const pool = require('../config/db');

// @desc    Search hospitals
// @route   GET /api/hospitals
// @access  Public
const searchHospitals = async (req, res) => {
  try {
    const { city, state, specialization, department, name, latitude, longitude, radius } = req.query;

    let query = `
      SELECT h.*, 
        COUNT(DISTINCT d.id) as department_count,
        COUNT(DISTINCT doc.id) as doctor_count,
        COUNT(DISTINCT a.id) FILTER (WHERE a.is_available = true) as available_ambulances
      FROM hospitals h
      LEFT JOIN departments d ON h.id = d.hospital_id AND d.is_active = true
      LEFT JOIN doctors doc ON h.id = doc.hospital_id AND doc.is_available = true
      LEFT JOIN ambulances a ON h.id = a.hospital_id
      WHERE h.is_verified = true
    `;

    const params = [];
    let paramCount = 0;

    if (city) {
      paramCount++;
      query += ` AND LOWER(h.city) LIKE LOWER($${paramCount})`;
      params.push(`%${city}%`);
    }

    if (state) {
      paramCount++;
      query += ` AND LOWER(h.state) LIKE LOWER($${paramCount})`;
      params.push(`%${state}%`);
    }

    if (name) {
      paramCount++;
      query += ` AND LOWER(h.name) LIKE LOWER($${paramCount})`;
      params.push(`%${name}%`);
    }

    if (department) {
      paramCount++;
      query += ` AND EXISTS (
        SELECT 1 FROM departments 
        WHERE hospital_id = h.id 
        AND LOWER(name) LIKE LOWER($${paramCount})
        AND is_active = true
      )`;
      params.push(`%${department}%`);
    }

    // Location-based search (within radius in km)
    if (latitude && longitude && radius) {
      paramCount += 3;
      query += ` AND (
        6371 * acos(
          cos(radians($${paramCount - 2})) * cos(radians(h.latitude)) *
          cos(radians(h.longitude) - radians($${paramCount - 1})) +
          sin(radians($${paramCount - 2})) * sin(radians(h.latitude))
        )
      ) <= $${paramCount}`;
      params.push(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));
    }

    query += ` GROUP BY h.id ORDER BY h.rating DESC, h.name ASC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Search hospitals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get hospital details
// @route   GET /api/hospitals/:id
// @access  Public
const getHospitalDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT h.*,
        json_agg(DISTINCT jsonb_build_object(
          'id', d.id,
          'name', d.name,
          'description', d.description,
          'head_doctor', d.head_doctor,
          'contact_number', d.contact_number
        )) FILTER (WHERE d.id IS NOT NULL) as departments,
        COUNT(DISTINCT a.id) FILTER (WHERE a.is_available = true) as available_ambulances
      FROM hospitals h
      LEFT JOIN departments d ON h.id = d.hospital_id AND d.is_active = true
      LEFT JOIN ambulances a ON h.id = a.hospital_id
      WHERE h.id = $1
      GROUP BY h.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get hospital details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get hospital departments
// @route   GET /api/hospitals/:id/departments
// @access  Public
const getHospitalDepartments = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT d.*,
        COUNT(doc.id) as doctor_count
      FROM departments d
      LEFT JOIN doctors doc ON d.id = doc.department_id AND doc.is_available = true
      WHERE d.hospital_id = $1 AND d.is_active = true
      GROUP BY d.id
      ORDER BY d.name`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get hospital departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get hospital doctors
// @route   GET /api/hospitals/:id/doctors
// @access  Public
const getHospitalDoctors = async (req, res) => {
  try {
    const { id } = req.params;
    const { department_id } = req.query;

    let query = `
      SELECT doc.*,
        d.name as department_name
      FROM doctors doc
      LEFT JOIN departments d ON doc.department_id = d.id
      WHERE doc.hospital_id = $1 AND doc.is_available = true
    `;

    const params = [id];

    if (department_id) {
      query += ` AND doc.department_id = $2`;
      params.push(department_id);
    }

    query += ` ORDER BY doc.full_name`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Get hospital doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get available ambulances
// @route   GET /api/hospitals/:id/ambulances
// @access  Public
const getAvailableAmbulances = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM ambulances 
       WHERE hospital_id = $1 AND is_available = true
       ORDER BY vehicle_type DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get available ambulances error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCities = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT city FROM hospitals ORDER BY city');
    res.json(result.rows.map(row => row.city));
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

const getHospitalNames = async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM hospitals ORDER BY name');
    res.json(result.rows.map(row => row.name));
  } catch (error) {
    console.error('Get hospital names error:', error);
    res.status(500).json({ error: 'Failed to fetch hospital names' });
  }
};

module.exports = {
  searchHospitals,
  getHospitalDetails,
  getHospitalDepartments,
  getHospitalDoctors,
  getAvailableAmbulances,
  getCities,
  getHospitalNames,
};

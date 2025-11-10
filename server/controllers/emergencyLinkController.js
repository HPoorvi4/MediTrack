const pool = require('../config/db');

// @desc    Create emergency link
// @route   POST /api/emergency-links
// @access  Private (Patient)
const createEmergencyLink = async (req, res) => {
  try {
    const { hospital_id, department_id, doctor_id, link_type, is_primary, notes } = req.body;

    // Get patient ID
    const patientResult = await pool.query(
      'SELECT id FROM patients WHERE user_id = $1',
      [req.user.id]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const patientId = patientResult.rows[0].id;

    // Verify hospital exists
    const hospitalExists = await pool.query(
      'SELECT id FROM hospitals WHERE id = $1',
      [hospital_id]
    );

    if (hospitalExists.rows.length === 0) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // If setting as primary, unset other primary links
    if (is_primary) {
      await pool.query(
        'UPDATE emergency_links SET is_primary = false WHERE patient_id = $1',
        [patientId]
      );
    }

    const result = await pool.query(
      `INSERT INTO emergency_links (patient_id, hospital_id, department_id, doctor_id, link_type, is_primary, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [patientId, hospital_id, department_id || null, doctor_id || null, link_type, is_primary || false, notes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create emergency link error:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ message: 'This emergency link already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patient's emergency links
// @route   GET /api/emergency-links
// @access  Private (Patient)
const getEmergencyLinks = async (req, res) => {
  try {
    // Get patient ID
    const patientResult = await pool.query(
      'SELECT id FROM patients WHERE user_id = $1',
      [req.user.id]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const result = await pool.query(
      `SELECT el.*,
        h.name as hospital_name,
        h.address as hospital_address,
        h.contact_number as hospital_contact,
        h.city as hospital_city,
        h.latitude as hospital_latitude,
        h.longitude as hospital_longitude,
        d.name as department_name,
        doc.full_name as doctor_name,
        doc.specialization as doctor_specialization,
        doc.contact_number as doctor_contact
      FROM emergency_links el
      JOIN hospitals h ON el.hospital_id = h.id
      LEFT JOIN departments d ON el.department_id = d.id
      LEFT JOIN doctors doc ON el.doctor_id = doc.id
      WHERE el.patient_id = $1
      ORDER BY el.is_primary DESC, el.created_at DESC`,
      [patientResult.rows[0].id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get emergency links error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update emergency link
// @route   PUT /api/emergency-links/:id
// @access  Private (Patient)
const updateEmergencyLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_primary, notes } = req.body;

    // Get patient ID
    const patientResult = await pool.query(
      'SELECT id FROM patients WHERE user_id = $1',
      [req.user.id]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const patientId = patientResult.rows[0].id;

    // If setting as primary, unset other primary links
    if (is_primary) {
      await pool.query(
        'UPDATE emergency_links SET is_primary = false WHERE patient_id = $1',
        [patientId]
      );
    }

    const result = await pool.query(
      `UPDATE emergency_links 
       SET is_primary = $1, notes = $2
       WHERE id = $3 AND patient_id = $4
       RETURNING *`,
      [is_primary, notes, id, patientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Emergency link not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update emergency link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete emergency link
// @route   DELETE /api/emergency-links/:id
// @access  Private (Patient)
const deleteEmergencyLink = async (req, res) => {
  try {
    const { id } = req.params;

    // Get patient ID
    const patientResult = await pool.query(
      'SELECT id FROM patients WHERE user_id = $1',
      [req.user.id]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const result = await pool.query(
      'DELETE FROM emergency_links WHERE id = $1 AND patient_id = $2 RETURNING *',
      [id, patientResult.rows[0].id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Emergency link not found' });
    }

    res.json({ message: 'Emergency link deleted successfully' });
  } catch (error) {
    console.error('Delete emergency link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEmergencyLink,
  getEmergencyLinks,
  updateEmergencyLink,
  deleteEmergencyLink,
};

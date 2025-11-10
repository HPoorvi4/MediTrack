const pool = require('../config/db');

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private (Patient)
const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        json_agg(DISTINCT jsonb_build_object(
          'id', ec.id,
          'contact_name', ec.contact_name,
          'relation', ec.relation,
          'phone_number', ec.phone_number,
          'priority', ec.priority
        )) FILTER (WHERE ec.id IS NOT NULL) as emergency_contacts,
        json_agg(DISTINCT jsonb_build_object(
          'id', hc.id,
          'category', hc.category,
          'additional_info', hc.additional_info
        )) FILTER (WHERE hc.id IS NOT NULL) as health_categories
      FROM patients p
      LEFT JOIN emergency_contacts ec ON p.id = ec.patient_id
      LEFT JOIN health_categories hc ON p.id = hc.patient_id
      WHERE p.user_id = $1
      GROUP BY p.id`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Private (Patient)
const updateProfile = async (req, res) => {
  try {
    const {
      full_name,
      date_of_birth,
      gender,
      blood_group,
      contact_number,
      address,
      city,
      state,
      pin_code,
    } = req.body;

    const result = await pool.query(
      `UPDATE patients 
       SET full_name = $1, date_of_birth = $2, gender = $3, blood_group = $4,
           contact_number = $5, address = $6, city = $7, state = $8, pin_code = $9
       WHERE user_id = $10
       RETURNING *`,
      [full_name, date_of_birth, gender, blood_group, contact_number, address, city, state, pin_code, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add emergency contact
// @route   POST /api/patients/emergency-contacts
// @access  Private (Patient)
const addEmergencyContact = async (req, res) => {
  try {
    const { contact_name, relation, phone_number, priority } = req.body;

    // Get patient ID
    const patientResult = await pool.query(
      'SELECT id FROM patients WHERE user_id = $1',
      [req.user.id]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const patientId = patientResult.rows[0].id;

    // Check if priority already exists
    const existingContact = await pool.query(
      'SELECT * FROM emergency_contacts WHERE patient_id = $1 AND priority = $2',
      [patientId, priority]
    );

    if (existingContact.rows.length > 0) {
      return res.status(400).json({ message: `Emergency contact with priority ${priority} already exists` });
    }

    const result = await pool.query(
      `INSERT INTO emergency_contacts (patient_id, contact_name, relation, phone_number, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [patientId, contact_name, relation, phone_number, priority]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update emergency contact
// @route   PUT /api/patients/emergency-contacts/:id
// @access  Private (Patient)
const updateEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { contact_name, relation, phone_number, priority } = req.body;

    // Get patient ID
    const patientResult = await pool.query(
      'SELECT id FROM patients WHERE user_id = $1',
      [req.user.id]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const result = await pool.query(
      `UPDATE emergency_contacts 
       SET contact_name = $1, relation = $2, phone_number = $3, priority = $4
       WHERE id = $5 AND patient_id = $6
       RETURNING *`,
      [contact_name, relation, phone_number, priority, id, patientResult.rows[0].id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update emergency contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete emergency contact
// @route   DELETE /api/patients/emergency-contacts/:id
// @access  Private (Patient)
const deleteEmergencyContact = async (req, res) => {
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
      'DELETE FROM emergency_contacts WHERE id = $1 AND patient_id = $2 RETURNING *',
      [id, patientResult.rows[0].id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }

    res.json({ message: 'Emergency contact deleted successfully' });
  } catch (error) {
    console.error('Delete emergency contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update health categories
// @route   PUT /api/patients/health-categories
// @access  Private (Patient)
const updateHealthCategories = async (req, res) => {
  try {
    const { categories } = req.body; // Array of { category, additional_info }

    // Get patient ID
    const patientResult = await pool.query(
      'SELECT id FROM patients WHERE user_id = $1',
      [req.user.id]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const patientId = patientResult.rows[0].id;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Delete existing categories
      await client.query('DELETE FROM health_categories WHERE patient_id = $1', [patientId]);

      // Insert new categories
      const insertedCategories = [];
      for (const cat of categories) {
        const result = await client.query(
          `INSERT INTO health_categories (patient_id, category, additional_info)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [patientId, cat.category, cat.additional_info || null]
        );
        insertedCategories.push(result.rows[0]);
      }

      await client.query('COMMIT');

      res.json(insertedCategories);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update health categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  updateHealthCategories,
};

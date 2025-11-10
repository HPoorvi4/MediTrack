const pool = require('../config/db');
const { sendBookingConfirmation, sendEmergencyAlert } = require('../utils/emailService');

// @desc    Create ambulance booking
// @route   POST /api/bookings
// @access  Private (Patient)
const createBooking = async (req, res) => {
  try {
    const {
      emergency_link_id,
      emergency_type,
      pickup_address,
      pickup_latitude,
      pickup_longitude,
      patient_condition,
    } = req.body;

    // Get patient ID and info
    const patientResult = await pool.query(
      'SELECT id, full_name, contact_number, email FROM patients WHERE user_id = $1',
      [req.user.id]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const patient = patientResult.rows[0];

    // Get emergency link details
    const linkResult = await pool.query(
      `SELECT el.*, h.id as hospital_id, h.name as hospital_name, h.address as hospital_address,
        h.latitude as hospital_latitude, h.longitude as hospital_longitude
      FROM emergency_links el
      JOIN hospitals h ON el.hospital_id = h.id
      WHERE el.id = $1 AND el.patient_id = $2`,
      [emergency_link_id, patient.id]
    );

    if (linkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Emergency link not found' });
    }

    const link = linkResult.rows[0];

    // Find available ambulance at the hospital
    const ambulanceResult = await pool.query(
      `SELECT * FROM ambulances 
       WHERE hospital_id = $1 AND is_available = true
       ORDER BY 
         CASE vehicle_type
           WHEN 'ICU' THEN 1
           WHEN 'Advanced' THEN 2
           WHEN 'Basic' THEN 3
           WHEN 'Neonatal' THEN 4
         END
       LIMIT 1`,
      [link.hospital_id]
    );

    if (ambulanceResult.rows.length === 0) {
      return res.status(400).json({ message: 'No ambulances available at this hospital' });
    }

    const ambulance = ambulanceResult.rows[0];

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create booking
      const bookingResult = await client.query(
        `INSERT INTO bookings (
          patient_id, hospital_id, emergency_link_id, ambulance_id, emergency_type,
          pickup_address, pickup_latitude, pickup_longitude,
          destination_address, destination_latitude, destination_longitude,
          patient_condition, status, estimated_arrival_time
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW() + INTERVAL '15 minutes')
        RETURNING *`,
        [
          patient.id,
          link.hospital_id,
          emergency_link_id,
          ambulance.id,
          emergency_type,
          pickup_address,
          pickup_latitude,
          pickup_longitude,
          link.hospital_address,
          link.hospital_latitude,
          link.hospital_longitude,
          patient_condition || null,
          'confirmed',
        ]
      );

      const booking = bookingResult.rows[0];

      // Mark ambulance as unavailable
      await client.query(
        'UPDATE ambulances SET is_available = false WHERE id = $1',
        [ambulance.id]
      );

      // Create initial tracking entry
      await client.query(
        `INSERT INTO booking_tracking (booking_id, latitude, longitude, status_update)
         VALUES ($1, $2, $3, $4)`,
        [booking.id, ambulance.current_latitude || pickup_latitude, ambulance.current_longitude || pickup_longitude, 'Ambulance assigned']
      );

      // Create notification
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES ($1, $2, $3, $4)`,
        [
          req.user.id,
          'Ambulance Booked',
          `Your ambulance booking has been confirmed. Ambulance ${ambulance.vehicle_number} is on the way.`,
          'booking',
        ]
      );

      await client.query('COMMIT');

      // Send email notification (async, don't wait)
      sendBookingConfirmation(patient.email, {
        id: booking.id,
        emergency_type: booking.emergency_type,
        pickup_address: booking.pickup_address,
        hospital_name: link.hospital_name,
        status: booking.status,
      }).catch(err => console.error('Email error:', err));

      sendEmergencyAlert(patient.email, {
        vehicle_number: ambulance.vehicle_number,
        driver_name: ambulance.driver_name,
        driver_contact: ambulance.driver_contact,
        estimated_arrival: booking.estimated_arrival_time,
      }).catch(err => console.error('Email error:', err));

      res.status(201).json({
        booking,
        ambulance: {
          vehicle_number: ambulance.vehicle_number,
          vehicle_type: ambulance.vehicle_type,
          driver_name: ambulance.driver_name,
          driver_contact: ambulance.driver_contact,
        },
        hospital: {
          name: link.hospital_name,
          address: link.hospital_address,
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private (Patient)
const getBookings = async (req, res) => {
  try {
    const { status } = req.query;

    // Get patient ID
    const patientResult = await pool.query(
      'SELECT id FROM patients WHERE user_id = $1',
      [req.user.id]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    let query = `
      SELECT b.*,
        h.name as hospital_name,
        h.address as hospital_address,
        h.contact_number as hospital_contact,
        a.vehicle_number,
        a.vehicle_type,
        a.driver_name,
        a.driver_contact
      FROM bookings b
      LEFT JOIN hospitals h ON b.hospital_id = h.id
      LEFT JOIN ambulances a ON b.ambulance_id = a.id
      WHERE b.patient_id = $1
    `;

    const params = [patientResult.rows[0].id];

    if (status) {
      query += ` AND b.status = $2`;
      params.push(status);
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get booking details
// @route   GET /api/bookings/:id
// @access  Private (Patient)
const getBookingDetails = async (req, res) => {
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
      `SELECT b.*,
        h.name as hospital_name,
        h.address as hospital_address,
        h.contact_number as hospital_contact,
        h.latitude as hospital_latitude,
        h.longitude as hospital_longitude,
        a.vehicle_number,
        a.vehicle_type,
        a.driver_name,
        a.driver_contact,
        a.current_latitude as ambulance_latitude,
        a.current_longitude as ambulance_longitude,
        json_agg(
          json_build_object(
            'latitude', bt.latitude,
            'longitude', bt.longitude,
            'status_update', bt.status_update,
            'timestamp', bt.created_at
          ) ORDER BY bt.created_at DESC
        ) FILTER (WHERE bt.id IS NOT NULL) as tracking_history
      FROM bookings b
      LEFT JOIN hospitals h ON b.hospital_id = h.id
      LEFT JOIN ambulances a ON b.ambulance_id = a.id
      LEFT JOIN booking_tracking bt ON b.id = bt.booking_id
      WHERE b.id = $1 AND b.patient_id = $2
      GROUP BY b.id, h.id, a.id`,
      [id, patientResult.rows[0].id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get booking details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Patient/Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellation_reason } = req.body;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE bookings 
         SET status = $1, 
             cancellation_reason = $2,
             completion_time = CASE WHEN $1 = 'completed' THEN NOW() ELSE completion_time END
         WHERE id = $3
         RETURNING *`,
        [status, cancellation_reason || null, id]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Booking not found' });
      }

      const booking = result.rows[0];

      // If cancelled or completed, make ambulance available again
      if (status === 'cancelled' || status === 'completed') {
        await client.query(
          'UPDATE ambulances SET is_available = true WHERE id = $1',
          [booking.ambulance_id]
        );
      }

      await client.query('COMMIT');

      res.json(booking);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Track ambulance location
// @route   POST /api/bookings/:id/track
// @access  Private (Driver/Admin)
const trackAmbulance = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, status_update } = req.body;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verify booking exists
      const bookingResult = await client.query(
        'SELECT ambulance_id FROM bookings WHERE id = $1',
        [id]
      );

      if (bookingResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Update ambulance current location
      await client.query(
        'UPDATE ambulances SET current_latitude = $1, current_longitude = $2 WHERE id = $3',
        [latitude, longitude, bookingResult.rows[0].ambulance_id]
      );

      // Add tracking entry
      const trackingResult = await client.query(
        `INSERT INTO booking_tracking (booking_id, latitude, longitude, status_update)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [id, latitude, longitude, status_update || null]
      );

      await client.query('COMMIT');

      res.json(trackingResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Track ambulance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingDetails,
  updateBookingStatus,
  trackAmbulance,
};

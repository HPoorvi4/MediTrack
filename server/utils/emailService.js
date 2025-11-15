const nodemailer = require('nodemailer');

// Create transporter only if email credentials are provided
let transporter = null;

if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  console.warn('Email credentials not configured. Email notifications will be disabled.');
}

const sendEmail = async (to, subject, html) => {
  if (!transporter) {
    console.log('Email not sent (transporter not configured):', { to, subject });
    return { messageId: 'email-disabled' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Ambulance Booking System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

const sendBookingConfirmation = async (email, bookingDetails) => {
  const subject = 'Ambulance Booking Confirmation';
  const html = `
    <h2>Ambulance Booking Confirmed</h2>
    <p>Your ambulance has been booked successfully.</p>
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Booking ID:</strong> ${bookingDetails.id}</li>
      <li><strong>Emergency Type:</strong> ${bookingDetails.emergency_type}</li>
      <li><strong>Pickup Address:</strong> ${bookingDetails.pickup_address}</li>
      <li><strong>Hospital:</strong> ${bookingDetails.hospital_name}</li>
      <li><strong>Status:</strong> ${bookingDetails.status}</li>
    </ul>
    <p>We will notify you when the ambulance is dispatched.</p>
    <p>For any queries, please contact the hospital directly.</p>
  `;

  return sendEmail(email, subject, html);
};

const sendEmergencyAlert = async (email, alertDetails) => {
  const subject = '🚨 Emergency Alert - Ambulance Dispatched';
  const html = `
    <h2 style="color: red;">Emergency Alert</h2>
    <p>An ambulance has been dispatched for your emergency.</p>
    <h3>Details:</h3>
    <ul>
      <li><strong>Ambulance Number:</strong> ${alertDetails.vehicle_number}</li>
      <li><strong>Driver:</strong> ${alertDetails.driver_name}</li>
      <li><strong>Contact:</strong> ${alertDetails.driver_contact}</li>
      <li><strong>Estimated Arrival:</strong> ${alertDetails.estimated_arrival}</li>
    </ul>
    <p style="color: red; font-weight: bold;">Please stay calm and wait at the pickup location.</p>
  `;

  return sendEmail(email, subject, html);
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendEmergencyAlert,
};

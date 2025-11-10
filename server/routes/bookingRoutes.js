const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingDetails,
  updateBookingStatus,
  trackAmbulance,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', authorize('patient'), createBooking);
router.get('/', authorize('patient'), getBookings);
router.get('/:id', authorize('patient'), getBookingDetails);
router.put('/:id/status', authorize('patient', 'admin'), updateBookingStatus);
router.post('/:id/track', authorize('ambulance_driver', 'admin'), trackAmbulance);

module.exports = router;

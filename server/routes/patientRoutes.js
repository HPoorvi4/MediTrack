const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  updateHealthCategories,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and patient-only
router.use(protect);
router.use(authorize('patient'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.post('/emergency-contacts', addEmergencyContact);
router.put('/emergency-contacts/:id', updateEmergencyContact);
router.delete('/emergency-contacts/:id', deleteEmergencyContact);

router.put('/health-categories', updateHealthCategories);

module.exports = router;

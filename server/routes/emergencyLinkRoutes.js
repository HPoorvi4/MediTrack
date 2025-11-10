const express = require('express');
const router = express.Router();
const {
  createEmergencyLink,
  getEmergencyLinks,
  updateEmergencyLink,
  deleteEmergencyLink,
} = require('../controllers/emergencyLinkController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and patient-only
router.use(protect);
router.use(authorize('patient'));

router.post('/', createEmergencyLink);
router.get('/', getEmergencyLinks);
router.put('/:id', updateEmergencyLink);
router.delete('/:id', deleteEmergencyLink);

module.exports = router;

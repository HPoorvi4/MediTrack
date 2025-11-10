const express = require('express');
const router = express.Router();
const {
  searchHospitals,
  getHospitalDetails,
  getHospitalDepartments,
  getHospitalDoctors,
  getAvailableAmbulances,
} = require('../controllers/hospitalController');

// Public routes
router.get('/', searchHospitals);
router.get('/:id', getHospitalDetails);
router.get('/:id/departments', getHospitalDepartments);
router.get('/:id/doctors', getHospitalDoctors);
router.get('/:id/ambulances', getAvailableAmbulances);

module.exports = router;

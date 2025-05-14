const express = require('express');
const router = express.Router();
const { getAllAnomalies, getAllComprehensiveCameraData } = require('../controllers/publicController');

router.get('/anomalies', getAllAnomalies);
router.get('/organization/cameras/comprehensive', getAllComprehensiveCameraData);

module.exports = router;

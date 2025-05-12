const express = require('express');
const router = express.Router();
const { getAllAnomalies } = require('../controllers/publicController');

router.get('/anomalies', getAllAnomalies);

module.exports = router;

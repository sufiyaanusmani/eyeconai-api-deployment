const express = require('express');
const router = express.Router();
const { getAnomalyAlerts, createAnomalyAlert, updateAnomalyAlert, getAnomaliesStats, getDailyAnomalyCounts, getCameraAnomalyCountsForToday } = require('../controllers/analyticsController');
const { authorizeRole } = require('../middlewares/authMiddleware');
const { ORGANIZATION_ADMIN } = require('../constants/roles');

// Routes
router.get('/anomaly', authorizeRole(ORGANIZATION_ADMIN), getAnomalyAlerts);
router.get('/anomaly/stats', authorizeRole(ORGANIZATION_ADMIN), getAnomaliesStats);
router.post('/anomaly', authorizeRole(ORGANIZATION_ADMIN), createAnomalyAlert);
router.patch('/anomaly/:alertId', authorizeRole(ORGANIZATION_ADMIN), updateAnomalyAlert);
router.get('/anomaly/daily-counts', authorizeRole(ORGANIZATION_ADMIN), getDailyAnomalyCounts);
router.get('/anomaly/counts/today', authorizeRole(ORGANIZATION_ADMIN), getCameraAnomalyCountsForToday);

module.exports = router;
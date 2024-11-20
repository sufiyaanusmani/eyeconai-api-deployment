const express = require('express');
const { authorizeRole } = require('../middlewares/authMiddleware');
const { addCamera, getAllCameras, updateCamera, deleteCamera } = require('../controllers/cameraController');
const { addAnomaly, getAllAnomalies, updateAnomaly, deleteAnomaly } = require('../controllers/anomalyController');
const ROLES = require("../constants/roles");

const router = express.Router();

router.get("/:orgId/cameras", authorizeRole(ROLES.ORGANIZATION_ADMIN), getAllCameras);
router.post("/:orgId/camera", authorizeRole(ROLES.ORGANIZATION_ADMIN), addCamera);
router.put("/:orgId/camera/:cameraId", authorizeRole(ROLES.ORGANIZATION_ADMIN), updateCamera);
router.delete("/:orgId/camera/:cameraId", authorizeRole(ROLES.ORGANIZATION_ADMIN), deleteCamera);

router.get("/:orgId/anomalies", authorizeRole(ROLES.ORGANIZATION_ADMIN), getAllAnomalies);
router.post("/:orgId/anomaly", authorizeRole(ROLES.ORGANIZATION_ADMIN), addAnomaly);
router.put("/:orgId/anomaly/:anomalyId", authorizeRole(ROLES.ORGANIZATION_ADMIN), updateAnomaly);
router.delete("/:orgId/anomaly/:anomalyId", authorizeRole(ROLES.ORGANIZATION_ADMIN), deleteAnomaly);

module.exports = router;
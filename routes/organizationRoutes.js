const express = require('express');
const { authorizeRole } = require('../middlewares/authMiddleware');
const { addCamera, getAllCameras, updateCamera, deleteCamera, getOnlineCameras, getCameraAnomalyStats, getComprehensiveCameraData, getOrganizationNormalConditions, getCamerasWithAnomalies } = require('../controllers/cameraController');
const { addAnomaly, getAllAnomalies, updateAnomaly, deleteAnomaly } = require('../controllers/anomalyController');
const ROLES = require("../constants/roles");
const { updateOrganization, getOrganizationDetails } = require('../controllers/organizationController');

const router = express.Router();

router.get("/:orgId/details", authorizeRole(ROLES.ORGANIZATION_ADMIN), getOrganizationDetails);
router.put("/:orgId", authorizeRole(ROLES.ORGANIZATION_ADMIN), updateOrganization);
router.get("/:orgId/cameras", authorizeRole(ROLES.ORGANIZATION_ADMIN), getAllCameras);
router.get("/:orgId/cameras/online", authorizeRole(ROLES.ORGANIZATION_ADMIN), getOnlineCameras);
router.post("/:orgId/camera", authorizeRole(ROLES.ORGANIZATION_ADMIN), addCamera);
router.put("/:orgId/camera/:cameraId", authorizeRole(ROLES.ORGANIZATION_ADMIN), updateCamera);
router.delete("/:orgId/camera/:cameraId", authorizeRole(ROLES.ORGANIZATION_ADMIN), deleteCamera);
router.get("/:orgId/camera/anomaly-stats", authorizeRole(ROLES.ORGANIZATION_ADMIN), getCameraAnomalyStats);
router.get("/:orgId/cameras/comprehensive", authorizeRole(ROLES.ORGANIZATION_ADMIN), getComprehensiveCameraData);
router.get("/:orgId/cameras/anomalies", authorizeRole(ROLES.ORGANIZATION_ADMIN), getCamerasWithAnomalies);

router.get("/:orgId/anomalies", authorizeRole(ROLES.ORGANIZATION_ADMIN), getAllAnomalies);
router.post("/:orgId/anomaly", authorizeRole(ROLES.ORGANIZATION_ADMIN), addAnomaly);
router.put("/:orgId/anomaly/:anomalyId", authorizeRole(ROLES.ORGANIZATION_ADMIN), updateAnomaly);
router.delete("/:orgId/anomaly/:anomalyId", authorizeRole(ROLES.ORGANIZATION_ADMIN), deleteAnomaly);

router.get("/:orgId/normal-conditions", authorizeRole(ROLES.ORGANIZATION_ADMIN), getOrganizationNormalConditions);

module.exports = router;
const express = require('express');
const { authorizeRole } = require('../middlewares/authMiddleware');
const { addCamera, getAllCameras, updateCamera, deleteCamera } = require('../controllers/cameraController');
const ROLES = require("../constants/roles");

const router = express.Router();

router.get("/:orgId/cameras", authorizeRole(ROLES.ORGANIZATION_ADMIN), getAllCameras);
router.post("/:orgId/camera", authorizeRole(ROLES.ORGANIZATION_ADMIN), addCamera);
router.put("/:orgId/camera/:cameraId", authorizeRole(ROLES.ORGANIZATION_ADMIN), updateCamera);
router.delete("/:orgId/camera/:cameraId", authorizeRole(ROLES.ORGANIZATION_ADMIN), deleteCamera);

module.exports = router;
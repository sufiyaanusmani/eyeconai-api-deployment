const express = require('express');
const { authorizeRole } = require('../middlewares/authMiddleware');
const { createOrganization, createOrganizationAdmin } = require('../controllers/organizationController');
const ROLES = require("../constants/roles");

const router = express.Router();

router.post("/organization", authorizeRole(ROLES.ADMIN), createOrganization);
router.post("/organization/:orgId/admin", authorizeRole(ROLES.ADMIN), createOrganizationAdmin);

module.exports = router;
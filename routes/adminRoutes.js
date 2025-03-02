const express = require('express');
const { authorizeRole } = require('../middlewares/authMiddleware');
const { createOrganization, createOrganizationAdmin, updateOrganization } = require('../controllers/organizationController');
const { getAllOrganizations } = require('../controllers/adminController');
const ROLES = require("../constants/roles");

const router = express.Router();

// Organization routes
router.get("/organizations", authorizeRole(ROLES.ADMIN), getAllOrganizations);
router.post("/organization", authorizeRole(ROLES.ADMIN), createOrganization);
router.post("/organization/:orgId/admin", authorizeRole(ROLES.ADMIN), createOrganizationAdmin);
router.put("/organization/:orgId", authorizeRole(ROLES.ADMIN), updateOrganization);

module.exports = router;
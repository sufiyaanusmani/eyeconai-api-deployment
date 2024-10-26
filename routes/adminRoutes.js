const express = require('express');
const { authorizeRole } = require('../middlewares/authMiddleware');
const { createOrganization, createOrganizationAdmin } = require('../controllers/organizationController');

const router = express.Router();

router.post("/organization", authorizeRole("Admin"), createOrganization);
router.post("/organization/:orgId/admin", authorizeRole("Admin"), createOrganizationAdmin);



module.exports = router;
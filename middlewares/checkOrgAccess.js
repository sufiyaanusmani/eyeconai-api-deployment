const ROLES = require("../constants/roles");

module.exports = (req, res, next) => {
    if (req.user.role === ROLES.ORGANIZATION_ADMIN && req.user.organizationId !== parseInt(req.params.orgId, 10)) {
      return res.status(403).json({ message: 'Access denied to this organization.' });
    }
    next();
  };
  
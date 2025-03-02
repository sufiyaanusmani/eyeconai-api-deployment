const ROLES = require('../constants/roles');
const { Organization, Role, User, Camera } = require('../models');

const createOrganization = async (req, res) => {
  const { name, maxCameras = 5 } = req.body;

  try {
    // Create a new organization
    const newOrganization = await Organization.create({
      name,
      maxCameras,
    });

    res.status(201).json({
      message: 'Organization created successfully!',
      organization: {
        id: newOrganization.orgId,
        name: newOrganization.name,
        maxCameras: newOrganization.maxCameras,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create organization', error: error.message });
  }
};


const createOrganizationAdmin = async (req, res) => {
  const organizationId = parseInt(req.params.orgId, 10); // Extract organizationId from route parameters
  const { username, name, email, password } = req.body;

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ where: { email } });
    const existingUsername = await User.findOne({ where: { username } });

    if (existingUser) return res.status(400).json({ message: 'Email already in use.' });
    if (existingUsername) return res.status(400).json({ message: 'Username already taken.' });

    // Check if organization exists
    const organization = await Organization.findByPk(organizationId);
    if (!organization) return res.status(400).json({ message: 'Invalid organization specified.' });

    // Get the role ID for "Organization Admin"
    const role = await Role.findOne({ where: { name: ROLES.ORGANIZATION_ADMIN } });
    if (!role) return res.status(400).json({ message: 'Role "Organization Admin" not found.' });

    // Create a new organization admin
    const newAdmin = await User.create({
      username,
      name,
      email,
      password, // Will be hashed in the User model
      roleId: role.roleId, // Use the fetched roleId
      organizationId: organization.orgId,
    });

    res.status(201).json({
      message: 'Organization admin created successfully!',
      admin: {
        id: newAdmin.userId,
        username: newAdmin.username,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create organization admin', error: error.message });
  }
};

const updateOrganization = async (req, res) => {
  const organizationId = parseInt(req.params.orgId, 10);
  const { name, maxCameras } = req.body;

  try {
    // Validate request body
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Find organization
    const organization = await Organization.findByPk(organizationId);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check if org admin is updating their own organization
    if (req.user.role === ROLES.ORGANIZATION_ADMIN && req.user.organizationId !== organizationId) {
      return res.status(403).json({ message: 'You can only update your own organization' });
    }

    // Update organization
    organization.name = name || organization.name;
    if (maxCameras !== undefined) organization.maxCameras = maxCameras;
    await organization.save();


    res.status(200).json({
      message: 'Organization updated successfully',
      organization: {
        id: organization.orgId,
        name: organization.name,
        maxCameras: organization.maxCameras,
      }
    });
  } catch (error) {
    console.error('[ERROR] Failed to update organization:', error);
    res.status(500).json({
      message: 'Failed to update organization',
      error: error.message
    });
  }
};

const getOrganizationDetails = async (req, res) => {
  try {
    const organizationId = parseInt(req.params.orgId, 10);

    // Ensure the user is authorized to view this organization
    if (req.user.role === ROLES.ORGANIZATION_ADMIN && req.user.organizationId !== organizationId) {
      return res.status(403).json({ message: 'You can only view your own organization' });
    }

    const organization = await Organization.findByPk(organizationId);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Get camera count
    const cameraCount = await Camera.count({ where: { organizationId } });

    res.status(200).json({
      organization: {
        id: organization.orgId,
        name: organization.name,
        maxCameras: organization.maxCameras,
        cameraCount: cameraCount,
        usagePercentage: Math.round((cameraCount / organization.maxCameras) * 100)
      }
    });
  } catch (error) {
    console.error('[ERROR] Failed to get organization details:', error);
    res.status(500).json({
      message: 'Failed to get organization details',
      error: error.message
    });
  }
};

// Add to exports
module.exports = {
  createOrganization,
  createOrganizationAdmin,
  updateOrganization,
  getOrganizationDetails // Add this
};
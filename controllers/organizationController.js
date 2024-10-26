const Organization = require('../models/Organization');
const Role = require('../models/Role');
const User = require('../models/User');

exports.createOrganization = async (req, res) => {
  const { name } = req.body;

  try {
    // Create a new organization
    const newOrganization = await Organization.create({
      name
    });

    res.status(201).json({
      message: 'Organization created successfully!',
      organization: {
        id: newOrganization.orgId,
        name: newOrganization.name
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create organization', error: error.message });
  }
};


exports.createOrganizationAdmin = async (req, res) => {
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
      const role = await Role.findOne({ where: { name: 'Organization Admin' } });
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

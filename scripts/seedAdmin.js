// scripts/seedAdmin.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Role = require('../models/Role'); // Import the Role model

const seedAdmin = async () => {
  const adminData = {
    username: 'admin',
    name: 'Sufiyaan Usmani',
    email: 'k213195@nu.edu.pk',
    password: 'admin', // Change this to something secure
    // roleId will be determined based on the role name
  };

  try {
    // Find the role ID for the 'Admin' role
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });

    if (!adminRole) {
      console.error('[ERROR] Admin role does not exist.');
      return;
    }

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ where: { roleId: adminRole.roleId } });
    
    if (!existingAdmin) {
      // Create the admin user with the found role ID
      await User.create({ ...adminData, roleId: adminRole.roleId });
      console.log('[INFO] Admin user created successfully!');
    } else {
      console.log('[INFO] Admin user already exists.');
    }
  } catch (error) {
    console.error('[ERROR] Failed to create Admin user:', error);
  }
};

seedAdmin().then(() => process.exit());
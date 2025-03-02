require('dotenv').config();
const { User, Role } = require('../models');

const seedAdmin = async () => {
  const adminData = {
    username: process.env.EYECON_ADMIN_USERNAME,
    name: process.env.EYECON_ADMIN_NAME,
    email: process.env.EYECON_ADMIN_EMAIL,
    password: process.env.EYECON_ADMIN_PASSWORD,
  };

  try {
    // Find the role ID for the 'Admin' role
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });

    if (!adminRole) {
      console.error('[ERROR] Admin role does not exist.');
      return;
    }

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ where: { username: adminData.username } });
    
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
require('dotenv').config(); 
const sequelize = require('../config/database');
const Role = require('../models/Role'); // Adjust the path as necessary

const roles = [
  { name: 'Admin' },
  { name: 'Organization Admin' },
  { name: 'User' },
];

const seedRoles = async () => {
  try {
    await sequelize.sync(); // Ensure the database is in sync with the models

    // Loop through the roles and create them
    for (const role of roles) {
      await Role.findOrCreate({
        where: { name: role.name },
        defaults: role,
      });
      console.log(`[INFO] Role '${role.name}' has been created or already exists.`);
    }
    
    console.log('[INFO] All roles seeded successfully!');
  } catch (error) {
    console.error('[ERROR] Error seeding roles:', error);
  } finally {
    await sequelize.close(); // Close the database connection
  }
};

// Run the seed function
seedRoles().then(() => process.exit());

const sequelize = require('../config/database');

// Import Models
const Role = require('./Role');
const User = require('./User');
const Organization = require('./Organization');
const Camera = require('./Camera');

// Define associations after importing all models
User.belongsTo(Role, { foreignKey: 'roleId' });
User.belongsTo(Organization, { foreignKey: 'organizationId' });
Organization.hasMany(Camera, { foreignKey: 'organizationId', onDelete: 'CASCADE' });
Camera.belongsTo(Organization, { foreignKey: 'organizationId' });

module.exports = { sequelize, User, Organization, Camera, Role };

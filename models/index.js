const sequelize = require('../config/database');

// Import Models
const Role = require('./Role');
const User = require('./User');
const Organization = require('./Organization');
const Camera = require('./Camera');
const Anomaly = require('./Anomaly');
const AnomalyCamera = require('./AnomalyCamera');
const NormalCondition = require('./NormalCondition');

// Define associations after importing all models
User.belongsTo(Role, { foreignKey: 'roleId' });
User.belongsTo(Organization, { foreignKey: 'organizationId' });
Organization.hasMany(Camera, { foreignKey: 'organizationId', onDelete: 'CASCADE' });
Organization.hasMany(User, { foreignKey: 'organizationId' });
Camera.belongsTo(Organization, { foreignKey: 'organizationId' });
Anomaly.belongsTo(Organization, { foreignKey: 'organizationId' });
Organization.hasMany(Anomaly, { foreignKey: 'organizationId', onDelete: 'CASCADE' });
Anomaly.belongsToMany(Camera, { through: AnomalyCamera });
Camera.belongsToMany(Anomaly, { through: AnomalyCamera });
Camera.hasMany(NormalCondition, { foreignKey: 'cameraId', onDelete: 'CASCADE' });
NormalCondition.belongsTo(Camera, { foreignKey: 'cameraId' });


module.exports = { sequelize, User, Organization, Camera, Role, Anomaly, AnomalyCamera, NormalCondition };
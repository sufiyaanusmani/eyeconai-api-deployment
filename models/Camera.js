const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Organization = require('./Organization');

const Camera = sequelize.define('Camera', {
  cameraId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isIP: true, // Ensures it's a valid IP address
    },
  },
  cameraType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Organization,
      key: 'orgId',
    },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  tableName: "Camera"
});

module.exports = Camera;

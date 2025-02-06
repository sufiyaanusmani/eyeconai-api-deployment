const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Organization = require('./Organization');
const STATUS = require('../constants/status');

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
  },
  cameraType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cameraDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ""
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Organization,
      key: 'orgId',
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: STATUS.ONLINE
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  tableName: "Camera"
});

module.exports = Camera;

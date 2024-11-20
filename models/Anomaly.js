const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Organization = require('./Organization'); // Import the Organization model
const Camera = require('./Camera'); // Import the Camera model
const Criticality = require('../constants/criticality'); // Import the criticality constants
const Status = require('../constants/status'); // Import the status constants

const Anomaly = sequelize.define('Anomaly', {
    anomalyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    criticality: {
        type: DataTypes.STRING, // Use enum values
        allowNull: false,
    },
    modelName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING, // Use enum values
        defaultValue: Status.OFF, // Default value using enum
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
    cameraId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Camera,
            key: 'cameraId',
        },
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: "Anomaly"
});

module.exports = Anomaly;

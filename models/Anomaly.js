const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Organization = require('./Organization'); // Import the Organization model
const Camera = require('./Camera'); // Import the Camera model
const Criticality = require('../constants/criticality'); // Import the criticality constants
const Status = require('../constants/status'); // Import the status constants
const DAYS_OF_WEEK = require('../constants/days');

const Anomaly = sequelize.define('Anomaly', {
    anomalyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    criticality: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    daysOfWeek: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isValidDays(value) {
                const days = JSON.parse(value);
                if (!Array.isArray(days) || !days.every(day => DAYS_OF_WEEK.includes(day))) {
                    throw new Error('Invalid days format');
                }
            }
        },
        get() {
            return JSON.parse(this.getDataValue('daysOfWeek'));
        },
        set(value) {
            this.setDataValue('daysOfWeek', JSON.stringify(value));
        }
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
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: "Anomaly"
});

module.exports = Anomaly;

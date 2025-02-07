const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Camera = require('./Camera');

const NormalCondition = sequelize.define('NormalCondition', {
    conditionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cameraId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Camera,
            key: 'cameraId',
        },
    }
}, {
    timestamps: true,
    tableName: "NormalCondition"
});

module.exports = NormalCondition;
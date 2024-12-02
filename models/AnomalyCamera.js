const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AnomalyCamera = sequelize.define('AnomalyCamera', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    timestamps: true,
    tableName: "AnomalyCamera"
});

module.exports = AnomalyCamera;
// config/database.js
const { Sequelize } = require('sequelize');
const { DATABASE_PATH } = require('../constants/databaseConstants');

// Create a new instance of Sequelize for SQLite using the constant path
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DATABASE_PATH,  // Use the constant for the database path
});

module.exports = sequelize;
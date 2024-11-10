const { Sequelize } = require('sequelize');

// Create a new instance of Sequelize for SQLite using the constant path
const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME,
  process.env.MYSQL_DB_USER,
  process.env.MYSQL_DB_PASSWORD,
  {
    host: process.env.MYSQL_DB_HOST,
    port: process.env.MYSQL_DB_PORT || 3306,
    dialect: 'mysql',
  }
);

module.exports = sequelize;
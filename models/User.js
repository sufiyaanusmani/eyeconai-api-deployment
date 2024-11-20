const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { hashPassword } = require('../utils/authUtils');
const Role = require('./Role');
const Organization = require('./Organization');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'roleId',
    },
    allowNull: false,
  },
  organizationId: {
    type: DataTypes.INTEGER,
    references: {
      model: Organization,
      key: 'orgId',
    },
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: "User",
  hooks: {
    beforeCreate: async (user) => {
      user.password = await hashPassword(user.password);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await hashPassword(user.password);
      }
    },
  },
});

module.exports = User;
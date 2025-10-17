const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('tutor','student'), allowNull: false },
}, {});

module.exports = User;

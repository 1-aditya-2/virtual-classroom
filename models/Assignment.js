const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Assignment = sequelize.define('Assignment', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  publishedAt: { type: DataTypes.DATE, allowNull: false },
  deadline: { type: DataTypes.DATE, allowNull: false },
}, {});

Assignment.belongsTo(User, { as: 'tutor', foreignKey: 'tutorId' });

module.exports = Assignment;

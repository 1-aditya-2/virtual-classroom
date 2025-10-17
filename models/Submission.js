const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Assignment = require('./Assignment');
const User = require('./User');

const Submission = sequelize.define('Submission', {
  remark: { type: DataTypes.TEXT },
}, {});

Submission.belongsTo(Assignment, { foreignKey: 'assignmentId' });
Submission.belongsTo(User, { as: 'student', foreignKey: 'studentId' });

module.exports = Submission;

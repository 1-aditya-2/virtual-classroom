const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Assignment = require('./Assignment');
const User = require('./User');

const AssignmentStudent = sequelize.define('AssignmentStudent', {}, {});

AssignmentStudent.belongsTo(Assignment, { foreignKey: 'assignmentId' });
AssignmentStudent.belongsTo(User, { as: 'student', foreignKey: 'studentId' });

module.exports = AssignmentStudent;

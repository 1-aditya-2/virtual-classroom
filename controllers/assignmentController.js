const { Op } = require('sequelize');
const Assignment = require('../models/Assignment');
const AssignmentStudent = require('../models/AssignmentStudent');
const Submission = require('../models/Submission');
const User = require('../models/User');

async function createAssignment(req, res) {
  try {
    const { title, description, publishedAt, deadline, studentIds } = req.body;
    if (!title || !publishedAt || !deadline) {
      return res.status(400).json({ message: 'title, publishedAt and deadline required' });
    }
    const assignment = await Assignment.create({
      title,
      description,
      publishedAt,
      deadline,
      tutorId: req.user.id,
    });
    if (Array.isArray(studentIds)) {
      const entries = studentIds.map((sid) => ({ assignmentId: assignment.id, studentId: sid }));
      await AssignmentStudent.bulkCreate(entries);
    }
    res.json({ assignment });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'server error' });
  }
}

async function updateAssignment(req, res) {
  try {
    const a = await Assignment.findByPk(req.params.id);
    if (!a) return res.status(404).json({ message: 'not found' });
    if (a.tutorId !== req.user.id) return res.status(403).json({ message: 'not owner' });
    const { title, description, publishedAt, deadline, studentIds } = req.body;
    await a.update({ title, description, publishedAt, deadline });
    if (Array.isArray(studentIds)) {
      await AssignmentStudent.destroy({ where: { assignmentId: a.id } });
      const entries = studentIds.map((sid) => ({ assignmentId: a.id, studentId: sid }));
      await AssignmentStudent.bulkCreate(entries);
    }
    res.json({ assignment: a });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'server error' });
  }
}

async function deleteAssignment(req, res) {
  try {
    const a = await Assignment.findByPk(req.params.id);
    if (!a) return res.status(404).json({ message: 'not found' });
    if (a.tutorId !== req.user.id) return res.status(403).json({ message: 'not owner' });
    await a.destroy();
    res.json({ message: 'deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'server error' });
  }
}

async function getAssignment(req, res) {
  try {
    const a = await Assignment.findByPk(req.params.id, {
      include: [{ model: User, as: 'tutor', attributes: ['id', 'username'] }],
    });
    if (!a) return res.status(404).json({ message: 'not found' });
    const now = new Date();
    const publishedStatus = new Date(a.publishedAt) > now ? 'SCHEDULED' : 'ONGOING';
    if (req.user.role === 'student') {
      const sub = await Submission.findOne({ where: { assignmentId: a.id, studentId: req.user.id } });
      let status = 'PENDING';
      if (sub) status = 'SUBMITTED';
      else if (new Date(a.deadline) < now) status = 'OVERDUE';
      res.json({ assignment: a, publishedStatus, submission: sub, studentStatus: status });
    } else {
      const subs = await Submission.findAll({
        where: { assignmentId: a.id },
        include: [{ model: User, as: 'student', attributes: ['id', 'username'] }],
      });
      res.json({ assignment: a, publishedStatus, submissions: subs });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'server error' });
  }
}

async function feed(req, res) {
  try {
    const { publishedAt, status } = req.query;
    const now = new Date();
    if (req.user.role === 'tutor') {
      let where = { tutorId: req.user.id };
      let assignments = await Assignment.findAll({ where, order: [['createdAt', 'DESC']] });
      if (publishedAt) {
        assignments = assignments.filter((a) => {
          const p = new Date(a.publishedAt) > now ? 'SCHEDULED' : 'ONGOING';
          return p === publishedAt;
        });
      }
      res.json({ assignments });
    } else {
      const as = await AssignmentStudent.findAll({ where: { studentId: req.user.id } });
      const ids = as.map((x) => x.assignmentId);
      let assignments = await Assignment.findAll({ where: { id: ids }, order: [['createdAt', 'DESC']] });
      if (publishedAt) {
        assignments = assignments.filter((a) => {
          const p = new Date(a.publishedAt) > now ? 'SCHEDULED' : 'ONGOING';
          return p === publishedAt;
        });
      }
      if (status && status !== 'ALL') {
        assignments = await Promise.all(
          assignments.map(async (a) => {
            const sub = await Submission.findOne({ where: { assignmentId: a.id, studentId: req.user.id } });
            let st = 'PENDING';
            if (sub) st = 'SUBMITTED';
            else if (new Date(a.deadline) < now) st = 'OVERDUE';
            return { assignment: a, status: st, submission: sub };
          })
        );
        assignments = assignments.filter((x) => x.status === status);
      } else {
        assignments = await Promise.all(
          assignments.map(async (a) => {
            const sub = await Submission.findOne({ where: { assignmentId: a.id, studentId: req.user.id } });
            let st = 'PENDING';
            if (sub) st = 'SUBMITTED';
            else if (new Date(a.deadline) < now) st = 'OVERDUE';
            return { assignment: a, status: st, submission: sub };
          })
        );
      }
      res.json({ assignments });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'server error' });
  }
}

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignment,
  feed,
};



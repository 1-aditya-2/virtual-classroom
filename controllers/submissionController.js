const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

async function submitAssignment(req, res) {
  try {
    const assignmentId = req.params.id;
    const existing = await Submission.findOne({ where: { assignmentId, studentId: req.user.id } });
    if (existing) return res.status(400).json({ message: 'Submission already exists' });
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    const submission = await Submission.create({ assignmentId, studentId: req.user.id, remark: req.body.remark || null });
    res.json({ submission });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'server error' });
  }
}

module.exports = { submitAssignment };



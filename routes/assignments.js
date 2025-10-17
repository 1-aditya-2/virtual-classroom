const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignment,
  feed,
} = require('../controllers/assignmentController');

// Create assignment (tutor)
router.post('/', authenticate, requireRole('tutor'), createAssignment);

// Update assignment (tutor)
router.put('/:id', authenticate, requireRole('tutor'), updateAssignment);

// Delete assignment (tutor)
router.delete('/:id', authenticate, requireRole('tutor'), deleteAssignment);

// GET /assignments/feed?publishedAt=ONGOING|SCHEDULED&status=ALL|PENDING|OVERDUE|SUBMITTED
router.get('/feed', authenticate, feed);

// Get assignment details
router.get('/:id', authenticate, getAssignment);

module.exports = router;

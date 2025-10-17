const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { submitAssignment } = require('../controllers/submissionController');

// Student adds a submission: POST /assignments/:id/submit
router.post('/:id/submit', authenticate, requireRole('student'), submitAssignment);

module.exports = router;

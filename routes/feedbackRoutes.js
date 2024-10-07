// routes/feedbackRoutes.js
const express = require('express');
const { submitFeedback } = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to authenticate user

const router = express.Router();

// POST route for feedback submission
router.post('/submit-feedback', authMiddleware.protect, submitFeedback);

module.exports = router;

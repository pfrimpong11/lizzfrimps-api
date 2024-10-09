// routes/feedbackRoutes.js
const express = require('express');
const { submitFeedback, getAllFeedback, deleteFeedback } = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to authenticate user

const router = express.Router();

// POST route for feedback submission
router.post('/submit-feedback', authMiddleware.protect, submitFeedback);

// Route to get all feedback
router.get('/admin/feedback', getAllFeedback);

// Route to delete feedback
router.delete('/admin/feedback/:id', deleteFeedback);


module.exports = router;

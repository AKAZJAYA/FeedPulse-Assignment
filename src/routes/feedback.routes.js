const express = require('express');
const feedbackController = require('../controllers/feedback.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router
    .route('/')
    .get(feedbackController.getAllFeedbacks)
    .post(feedbackController.createFeedback);

router
    .route('/:id')
    .get(feedbackController.getFeedbackById);

// Protected routes (admin only)
router
    .route('/:id')
    .patch(protect, feedbackController.updateFeedback)
    .delete(protect, feedbackController.deleteFeedback);

module.exports = router;

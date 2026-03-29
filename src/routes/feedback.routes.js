const express = require('express');
const feedbackController = require('../controllers/feedback.controller');

const router = express.Router();

router
    .route('/')
    .get(feedbackController.getAllFeedbacks)
    .post(feedbackController.createFeedback);

router
    .route('/:id')
    .get(feedbackController.getFeedbackById)
    .patch(feedbackController.updateFeedback)
    .delete(feedbackController.deleteFeedback);

module.exports = router;

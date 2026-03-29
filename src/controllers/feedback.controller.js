const feedbackService = require('../services/feedback.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Create new feedback
 * @route   POST /api/feedbacks
 */
const createFeedback = catchAsync(async (req, res) => {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    // ─── Input Validation ──────────────────────────────
    if (!title || !title.trim()) {
        throw new ApiError(400, 'Title is required');
    }

    if (!description || description.trim().length < 20) {
        throw new ApiError(400, 'Description is required and must be at least 20 characters');
    }

    const feedback = await feedbackService.createFeedback({
        title,
        description,
        category,
        submitterName,
        submitterEmail,
    });

    res.status(201).json({
        success: true,
        data: feedback,
        error: null,
        message: 'Feedback submitted successfully',
    });
});

/**
 * @desc    Get all feedbacks
 * @route   GET /api/feedbacks
 */
const getAllFeedbacks = catchAsync(async (req, res) => {
    const feedbacks = await feedbackService.getAllFeedbacks(req.query);

    res.status(200).json({
        success: true,
        data: feedbacks,
        error: null,
        message: `Found ${feedbacks.length} feedback(s)`,
    });
});

/**
 * @desc    Get single feedback by ID
 * @route   GET /api/feedbacks/:id
 */
const getFeedbackById = catchAsync(async (req, res) => {
    const feedback = await feedbackService.getFeedbackById(req.params.id);

    res.status(200).json({
        success: true,
        data: feedback,
        error: null,
        message: 'Feedback retrieved successfully',
    });
});

/**
 * @desc    Update feedback by ID
 * @route   PUT /api/feedbacks/:id
 */
const updateFeedback = catchAsync(async (req, res) => {
    const feedback = await feedbackService.updateFeedback(req.params.id, req.body);

    res.status(200).json({
        success: true,
        data: feedback,
        error: null,
        message: 'Feedback updated successfully',
    });
});

/**
 * @desc    Delete feedback by ID
 * @route   DELETE /api/feedbacks/:id
 */
const deleteFeedback = catchAsync(async (req, res) => {
    await feedbackService.deleteFeedback(req.params.id);

    res.status(200).json({
        success: true,
        data: null,
        error: null,
        message: 'Feedback deleted successfully',
    });
});

module.exports = {
    createFeedback,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
};

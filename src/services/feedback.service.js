const Feedback = require('../models/Feedback');
const ApiError = require('../utils/ApiError');

/**
 * Create a new feedback entry.
 */
const createFeedback = async (data) => {
    const feedback = await Feedback.create(data);
    return feedback;
};

/**
 * Get all feedbacks with optional filtering.
 */
const getAllFeedbacks = async (query = {}) => {
    const filter = {};

    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
    return feedbacks;
};

/**
 * Get a single feedback by ID.
 */
const getFeedbackById = async (id) => {
    const feedback = await Feedback.findById(id);
    if (!feedback) {
        throw new ApiError(404, `Feedback not found with id: ${id}`);
    }
    return feedback;
};

/**
 * Update a feedback by ID.
 */
const updateFeedback = async (id, data) => {
    const feedback = await Feedback.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!feedback) {
        throw new ApiError(404, `Feedback not found with id: ${id}`);
    }
    return feedback;
};

/**
 * Delete a feedback by ID.
 */
const deleteFeedback = async (id) => {
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
        throw new ApiError(404, `Feedback not found with id: ${id}`);
    }
    return feedback;
};

module.exports = {
    createFeedback,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
};

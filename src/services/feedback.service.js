const Feedback = require('../models/Feedback');
const ApiError = require('../utils/ApiError');
const { analyzeFeedback } = require('./ai.service');

/**
 * Create a new feedback entry.
 */
const createFeedback = async (data) => {
    const feedback = await Feedback.create(data);
    return feedback;
};

/**
 * Process AI analysis in the background (fire-and-forget).
 * Never throws — logs errors and exits gracefully.
 */
const processAIAnalysis = async (feedbackId, title, description) => {
    try {
        console.log(`🤖 Starting AI analysis for feedback: ${feedbackId}`);
        const aiResult = await analyzeFeedback(title, description);

        if (!aiResult) {
            console.warn(`⚠️  AI analysis returned null for feedback: ${feedbackId}`);
            return;
        }

        await Feedback.findByIdAndUpdate(feedbackId, {
            ai_category: aiResult.category,
            ai_sentiment: aiResult.sentiment,
            ai_priority: aiResult.priority_score,
            ai_summary: aiResult.summary,
            ai_tags: aiResult.tags,
            ai_processed: true,
        });

        console.log(`✅ AI analysis saved for feedback: ${feedbackId}`);
    } catch (error) {
        console.error(`❌ AI processing failed for feedback ${feedbackId}:`, error.message);
        // Never crash — feedback is already saved
    }
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
    processAIAnalysis,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
};

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        // ─── Core Fields ───────────────────────────────────
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [120, 'Title cannot exceed 120 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            minlength: [20, 'Description must be at least 20 characters'],
        },
        category: {
            type: String,
            enum: {
                values: ['Bug', 'Feature Request', 'Improvement', 'Other'],
                message: '{VALUE} is not a valid category',
            },
            required: [true, 'Category is required'],
        },
        status: {
            type: String,
            enum: {
                values: ['New', 'In Review', 'Resolved'],
                message: '{VALUE} is not a valid status',
            },
            default: 'New',
        },

        // ─── Submitter Info ────────────────────────────────
        submitterName: {
            type: String,
            trim: true,
        },
        submitterEmail: {
            type: String,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address',
            ],
        },

        // ─── AI-Generated Fields ───────────────────────────
        ai_category: {
            type: String,
            trim: true,
        },
        ai_sentiment: {
            type: String,
            enum: {
                values: ['Positive', 'Neutral', 'Negative'],
                message: '{VALUE} is not a valid sentiment',
            },
        },
        ai_priority: {
            type: Number,
            min: [1, 'Priority must be at least 1'],
            max: [10, 'Priority cannot exceed 10'],
        },
        ai_summary: {
            type: String,
            trim: true,
        },
        ai_tags: {
            type: [String],
            default: [],
        },
        ai_processed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ─────────────────────────────────────────
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ ai_priority: -1 });
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);

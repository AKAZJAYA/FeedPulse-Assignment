const Feed = require('../models/Feed');
const ApiError = require('../utils/ApiError');

/**
 * Get all feeds, with optional filtering by category and isActive.
 */
const getAllFeeds = async (query = {}) => {
    const filter = {};

    if (query.category) {
        filter.category = query.category;
    }

    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === 'true';
    }

    const feeds = await Feed.find(filter).sort({ createdAt: -1 });
    return feeds;
};

/**
 * Get a single feed by its ID.
 */
const getFeedById = async (id) => {
    const feed = await Feed.findById(id);

    if (!feed) {
        throw new ApiError(404, `Feed not found with id: ${id}`);
    }

    return feed;
};

/**
 * Create a new feed.
 */
const createFeed = async (data) => {
    const feed = await Feed.create(data);
    return feed;
};

/**
 * Update a feed by its ID.
 */
const updateFeed = async (id, data) => {
    const feed = await Feed.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!feed) {
        throw new ApiError(404, `Feed not found with id: ${id}`);
    }

    return feed;
};

/**
 * Delete a feed by its ID.
 */
const deleteFeed = async (id) => {
    const feed = await Feed.findByIdAndDelete(id);

    if (!feed) {
        throw new ApiError(404, `Feed not found with id: ${id}`);
    }

    return feed;
};

module.exports = {
    getAllFeeds,
    getFeedById,
    createFeed,
    updateFeed,
    deleteFeed,
};

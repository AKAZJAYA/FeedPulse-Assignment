const feedService = require('../services/feed.service');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get all feeds
 * @route   GET /api/feeds
 */
const getAllFeeds = catchAsync(async (req, res) => {
    const feeds = await feedService.getAllFeeds(req.query);
    res.status(200).json({
        success: true,
        count: feeds.length,
        data: feeds,
    });
});

/**
 * @desc    Get a single feed by ID
 * @route   GET /api/feeds/:id
 */
const getFeedById = catchAsync(async (req, res) => {
    const feed = await feedService.getFeedById(req.params.id);
    res.status(200).json({
        success: true,
        data: feed,
    });
});

/**
 * @desc    Create a new feed
 * @route   POST /api/feeds
 */
const createFeed = catchAsync(async (req, res) => {
    const feed = await feedService.createFeed(req.body);
    res.status(201).json({
        success: true,
        data: feed,
    });
});

/**
 * @desc    Update a feed by ID
 * @route   PUT /api/feeds/:id
 */
const updateFeed = catchAsync(async (req, res) => {
    const feed = await feedService.updateFeed(req.params.id, req.body);
    res.status(200).json({
        success: true,
        data: feed,
    });
});

/**
 * @desc    Delete a feed by ID
 * @route   DELETE /api/feeds/:id
 */
const deleteFeed = catchAsync(async (req, res) => {
    await feedService.deleteFeed(req.params.id);
    res.status(200).json({
        success: true,
        data: {},
        message: 'Feed deleted successfully',
    });
});

module.exports = {
    getAllFeeds,
    getFeedById,
    createFeed,
    updateFeed,
    deleteFeed,
};

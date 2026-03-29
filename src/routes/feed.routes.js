const express = require('express');
const feedController = require('../controllers/feed.controller');

const router = express.Router();

router
    .route('/')
    .get(feedController.getAllFeeds)
    .post(feedController.createFeed);

router
    .route('/:id')
    .get(feedController.getFeedById)
    .put(feedController.updateFeed)
    .delete(feedController.deleteFeed);

module.exports = router;

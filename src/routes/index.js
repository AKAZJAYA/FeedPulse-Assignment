const express = require('express');
const feedRoutes = require('./feed.routes');
const feedbackRoutes = require('./feedback.routes');
const authRoutes = require('./auth.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/feeds', feedRoutes);
router.use('/feedback', feedbackRoutes);

module.exports = router;

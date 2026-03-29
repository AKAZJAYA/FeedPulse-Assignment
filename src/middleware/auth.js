const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to protect routes — verifies JWT token.
 *
 * Usage:
 *   const { protect } = require('../middleware/auth');
 *   router.get('/protected', protect, controller.handler);
 */
const protect = (req, _res, next) => {
    let token;

    // Extract token from Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError(401, 'Not authorized. No token provided.'));
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new ApiError(401, 'Not authorized. Invalid token.'));
    }
};

module.exports = { protect };

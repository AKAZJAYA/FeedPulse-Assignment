const ApiError = require('../utils/ApiError');

/**
 * Catch-all middleware for undefined routes.
 * Creates a 404 error and forwards it to the error handler.
 */
const notFound = (req, _res, next) => {
    next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

module.exports = { notFound };

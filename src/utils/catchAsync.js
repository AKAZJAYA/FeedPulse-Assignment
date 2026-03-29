/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to Express's next() error handler.
 *
 * Usage:
 *   const catchAsync = require('../utils/catchAsync');
 *   const handler = catchAsync(async (req, res) => { ... });
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = catchAsync;

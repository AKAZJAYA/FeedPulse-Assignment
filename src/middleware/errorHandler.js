const config = require('../config');

/**
 * Global error-handling middleware (4-arg signature).
 * Sends structured JSON error responses.
 */
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    const response = {
        success: false,
        statusCode,
        message,
    };

    // Include stack trace only in development
    if (config.env === 'development') {
        response.stack = err.stack;
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        response.statusCode = 400;
        response.message = `Invalid ${err.path}: ${err.value}`;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        response.statusCode = 400;
        const field = Object.keys(err.keyValue).join(', ');
        response.message = `Duplicate field value for: ${field}`;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        response.statusCode = 400;
        const messages = Object.values(err.errors).map((val) => val.message);
        response.message = messages.join('. ');
    }

    console.error('❌ Error:', err);

    res.status(response.statusCode).json(response);
};

module.exports = { errorHandler };

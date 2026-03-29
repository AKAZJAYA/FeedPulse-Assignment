/**
 * Custom API error class.
 *
 * Extends the built-in Error with a statusCode property
 * so the global error handler can return the correct HTTP status.
 */
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;

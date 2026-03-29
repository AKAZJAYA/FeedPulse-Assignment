const ApiError = require('../utils/ApiError');

/**
 * Generic request-body validation middleware.
 *
 * Usage:
 *   const { validate } = require('../middleware/validate');
 *   router.post('/', validate(['title', 'url']), controller.create);
 *
 * @param {string[]} requiredFields - Array of field names that must be present in req.body.
 */
const validate = (requiredFields = []) => {
    return (req, _res, next) => {
        const missing = requiredFields.filter(
            (field) => req.body[field] === undefined || req.body[field] === ''
        );

        if (missing.length > 0) {
            return next(
                new ApiError(400, `Missing required fields: ${missing.join(', ')}`)
            );
        }

        next();
    };
};

module.exports = { validate };

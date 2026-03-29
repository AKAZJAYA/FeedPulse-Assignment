const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// ─── Hardcoded Admin Credentials ───────────────────
const ADMIN_EMAIL = 'admin@feedpulse.com';
const ADMIN_PASSWORD = 'admin123';

/**
 * @desc    Admin login
 * @route   POST /api/auth/login
 */
const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    // Check credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
        { email: ADMIN_EMAIL, role: 'admin' },
        config.jwtSecret,
        { expiresIn: '1d' }
    );

    res.status(200).json({
        success: true,
        data: { token },
        error: null,
        message: 'Login successful',
    });
});

module.exports = { login };

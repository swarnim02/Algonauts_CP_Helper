const rateLimit = require('express-rate-limit');

/**
 * Limits are configurable so local development and seeding/demo runs aren't
 * blocked by the strict production defaults.
 */
const num = (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
};

const AUTH_WINDOW_MIN = num(process.env.AUTH_RATE_LIMIT_WINDOW_MIN, 15);
const AUTH_MAX = num(process.env.AUTH_RATE_LIMIT_MAX, 5);
const API_WINDOW_MIN = num(process.env.API_RATE_LIMIT_WINDOW_MIN, 15);
const API_MAX = num(process.env.API_RATE_LIMIT_MAX, 100);

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: AUTH_WINDOW_MIN * 60 * 1000,
    max: AUTH_MAX,
    message: {
        error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Rate limiting for general API endpoints
const apiLimiter = rateLimit({
    windowMs: API_WINDOW_MIN * 60 * 1000,
    max: API_MAX,
    message: {
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    authLimiter,
    apiLimiter
};

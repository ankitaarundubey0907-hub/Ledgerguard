const rateLimit = require("express-rate-limit");

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Strict limiter for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many login attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    apiLimiter,
    loginLimiter
};
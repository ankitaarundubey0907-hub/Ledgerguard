require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 5000,

    MONGODB_URI: process.env.MONGODB_URI,

    JWT_SECRET: process.env.JWT_SECRET,

    REDIS_URL: process.env.REDIS_URL,

    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,

    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET
};
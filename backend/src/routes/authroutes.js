const express = require("express");

const {
    register,
    login
} = require("../controllers/authcontroller");

const {
    loginLimiter
} = require("../middleware/ratelimitmiddleware");

const validateRequest = require("../middleware/validationmiddleware");

const {
    body
} = require("express-validator");

const router = express.Router();


// REGISTER
router.post(
    "/register", [
        body("companyName")
        .trim()
        .notEmpty()
        .withMessage("Company name is required"),

        body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

        body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

        body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
    ],
    validateRequest,
    register
);


// LOGIN
router.post(
    "/login",
    loginLimiter, [
        body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

        body("password")
        .notEmpty()
        .withMessage("Password is required")
    ],
    validateRequest,
    login
);


module.exports = router;
const express = require("express");

const {
    createSubscription,
    getCurrentSubscription,
    cancelSubscription
} = require("../controllers/subscriptioncontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", authMiddleware, createSubscription);

router.get("/", authMiddleware, getCurrentSubscription);

router.patch("/cancel", authMiddleware, cancelSubscription);

module.exports = router;
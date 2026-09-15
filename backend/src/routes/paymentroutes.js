const express = require("express");

const {
    createOrder,
    verifyPayment
} = require("../controllers/paymentcontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post(
    "/create-order",
    authMiddleware,
    createOrder
);

router.post(
    "/verify",
    authMiddleware,
    verifyPayment
);

module.exports = router;
const express = require("express");
const {
    createTransaction,
    getTransactions
} = require("../controllers/transactioncontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTransaction);

router.get("/", authMiddleware, getTransactions);

module.exports = router;
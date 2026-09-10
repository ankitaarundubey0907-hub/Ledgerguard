const express = require("express");
const {
    createTransaction,
    getTransactions,
    updateTransaction,deleteTransaction
} = require("../controllers/transactioncontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTransaction);

router.get("/", authMiddleware, getTransactions);

router.patch("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);
module.exports = router;
const express = require("express");
const {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getFinancialSummary,
    getFinancialReport
} = require("../controllers/transactioncontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTransaction);

router.get("/", authMiddleware, getTransactions);
router.get("/dashboard", authMiddleware, getFinancialSummary);
router.get("/reports", authMiddleware, getFinancialReport);

router.patch("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);
module.exports = router;
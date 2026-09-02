const Transaction = require("../models/transaction");

const createTransaction = async (req, res) => {
    try {
        const { type, amount, description, category } = req.body;

        if (!type || !amount || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const transaction = await Transaction.create({
            type,
            amount,
            description,
            category,
            userId: req.user.userId,
            tenantId: req.user.tenantId
        });

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            tenantId: req.user.tenantId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createTransaction,
    getTransactions
};
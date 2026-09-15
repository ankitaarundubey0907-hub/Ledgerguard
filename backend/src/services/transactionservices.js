const Transaction = require("../models/transaction");
const mongoose = require("mongoose");
const createTransaction = async ({
    tenantId,
    userId,
    type,
    amount,
    category,
    description,
    date
}) => {
    const transaction = await Transaction.create({
        tenantId,
        userId,
        type,
        amount,
        category,
        description,
        date
    });

    return transaction;
};

const getTransactions = async (tenantId) => {
    const transactions = await Transaction.find({
        tenantId
    }).sort({ createdAt: -1 });

    return transactions;
};

const updateTransaction = async (
    id,
    tenantId,
    updateData
) => {
    const transaction = await Transaction.findOneAndUpdate(
        {
            _id: id,
            tenantId
        },
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    return transaction;
};

const deleteTransaction = async (id, tenantId) => {
    const transaction = await Transaction.findOneAndDelete({
        _id: id,
        tenantId
    });

    return transaction;
};

const getFinancialSummary = async (tenantId) => {
    const result = await Transaction.aggregate([
        {
            $match: {
                tenantId: new mongoose.Types.ObjectId(tenantId)
            }
        },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" }
            }
        }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    result.forEach((item) => {
        if (item._id === "income") {
            totalIncome = item.total;
        }

        if (item._id === "expense") {
            totalExpense = item.total;
        }
    });

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
    };
};

const getFinancialReport = async (tenantId, startDate, endDate) => {
    const match = {
        tenantId: new mongoose.Types.ObjectId(tenantId)
    };

    if (startDate || endDate) {
        match.createdAt = {};

        if (startDate) {
            match.createdAt.$gte = new Date(startDate);
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            match.createdAt.$lte = end;
        }
    }

    const report = await Transaction.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: "$type",
                totalAmount: { $sum: "$amount" },
                transactionCount: { $sum: 1 }
            }
        }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let incomeTransactions = 0;
    let expenseTransactions = 0;

    report.forEach((item) => {
        if (item._id === "income") {
            totalIncome = item.totalAmount;
            incomeTransactions = item.transactionCount;
        }

        if (item._id === "expense") {
            totalExpense = item.totalAmount;
            expenseTransactions = item.transactionCount;
        }
    });

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        incomeTransactions,
        expenseTransactions
    };
};
module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getFinancialSummary,
    getFinancialReport
};
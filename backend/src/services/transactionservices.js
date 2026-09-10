const Transaction = require("../models/transaction");

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

module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
};
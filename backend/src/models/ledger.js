const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true
    },

    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true
    },

    type: {
        type: String,
        enum: ["credit", "debit"],
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Ledger", ledgerSchema);
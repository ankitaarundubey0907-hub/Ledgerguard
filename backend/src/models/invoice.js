const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true
    },

    customerName: {
        type: String,
        required: true,
        trim: true
    },

    customerEmail: {
        type: String,
        trim: true,
        lowercase: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ["Paid", "Pending", "Overdue"],
        default: "Pending"
    },

    dueDate: {
        type: Date,
        required: true
    },

    description: {
        type: String,
        trim: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Invoice", invoiceSchema);
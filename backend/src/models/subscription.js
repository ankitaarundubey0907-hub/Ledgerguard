const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tenant",
            required: true
        },

        plan: {
            type: String,
            enum: ["trial", "monthly", "yearly"],
            default: "trial"
        },

        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active"
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        startDate: {
            type: Date,
            default: Date.now
        },

        endDate: {
            type: Date,
            required: true
        },

        razorpayOrderId: {
            type: String,
            default: null
        },

        razorpayPaymentId: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Subscription",
    subscriptionSchema
);
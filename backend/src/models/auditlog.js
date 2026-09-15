const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tenant",
            required: true
        },

        action: {
            type: String,
            required: true,
            enum: [
                "CREATE_TRANSACTION",
                "UPDATE_TRANSACTION",
                "DELETE_TRANSACTION",
                "CREATE_PAYMENT",
                "CREATE_SUBSCRIPTION",
                "CANCEL_SUBSCRIPTION"
            ]
        },

        resourceType: {
            type: String,
            required: true
        },

        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        details: {
            type: String,
            default: ""
        },

        ipAddress: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "AuditLog",
    auditLogSchema
);
const mongoose = require("mongoose");
const tenantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        plan: {
            type: String,
            enum: ["Basic", "Premium", "Enterprise"],
            default: "Basic"
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model("Tenant", tenantSchema);
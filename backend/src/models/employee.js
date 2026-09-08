const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
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

    phone: {
        type: String,
        trim: true
    },

    role: {
        type: String,
        required: true,
        trim: true
    },

    department: {
        type: String,
        required: true,
        trim: true
    },

    joiningDate: {
        type: Date
    },

    salary: {
        type: Number,
        min: 0
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },

    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Employee", employeeSchema);
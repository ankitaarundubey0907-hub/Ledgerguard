
const Tenant = require("../models/tenant");
const { redisClient } = require("../config/redis");
// ========================================
// GET ALL TENANTS
// ========================================

// const getTenants = async (req, res) => {
//     try {
//         const tenants = await Tenant.find()
//             .sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             data: tenants
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

const getTenants = async (req, res) => {
    try {
        const cacheKey = "tenants:all";

        // 1. Check Redis first
        const cachedTenants = await redisClient.get(cacheKey);

        if (cachedTenants) {
            console.log("Tenants loaded from Redis");

            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedTenants),
                cached: true
            });
        }

        // 2. Redis miss → get from MongoDB
        const tenants = await Tenant.find()
            .sort({ createdAt: -1 });

        // 3. Store result in Redis for 5 minutes
        await redisClient.setEx(
            cacheKey,
            300,
            JSON.stringify(tenants)
        );

        console.log("Tenants loaded from MongoDB");

        res.status(200).json({
            success: true,
            data: tenants,
            cached: false
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// GET SINGLE TENANT
// ========================================

const getTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findById(
            req.params.id
        );

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found"
            });
        }

        res.status(200).json({
            success: true,
            data: tenant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// CREATE TENANT
// ========================================

const createTenant = async (req, res) => {
    try {
        const {
            name,
            email,
            plan
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const existingTenant =
            await Tenant.findOne({ email });

        if (existingTenant) {
            return res.status(409).json({
                success: false,
                message: "Tenant with this email already exists"
            });
        }

        const tenant = await Tenant.create({
            name,
            email,
            plan: plan || "Basic"
        });

        res.status(201).json({
            success: true,
            message: "Tenant created successfully",
            data: tenant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// UPDATE TENANT
// ========================================

const updateTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Tenant updated successfully",
            data: tenant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// DELETE TENANT
// ========================================

const deleteTenant = async (req, res) => {
    try {
        const tenant =
            await Tenant.findByIdAndDelete(
                req.params.id
            );

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Tenant deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant
};
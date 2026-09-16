const Tenant = require("../models/tenant");
const { redisClient } = require("../config/redis");

// ========================================
// GET ALL TENANTS
// ========================================

const getTenants = async (req, res) => {
    try {
        const cacheKey = "tenants:all";

        // Check Redis first
        const cachedTenants = await redisClient.get(cacheKey);

        if (cachedTenants) {
            console.log("Tenants loaded from Redis");

            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedTenants),
                cached: true
            });
        }

        // Redis miss → get from MongoDB
        const tenants = await Tenant.find()
            .sort({ createdAt: -1 });

        // Save data in Redis for 5 minutes
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
        console.error("Get tenants error:", error);

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
        const tenant = await Tenant.findById(req.params.id);

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
        console.error("Get tenant error:", error);

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

        const existingTenant = await Tenant.findOne({ email });

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

        // Clear Redis cache
        await redisClient.del("tenants:all");

        res.status(201).json({
            success: true,
            message: "Tenant created successfully",
            data: tenant
        });

    } catch (error) {
        console.error("Create tenant error:", error);

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

        // Clear Redis cache
        await redisClient.del("tenants:all");

        res.status(200).json({
            success: true,
            message: "Tenant updated successfully",
            data: tenant
        });

    } catch (error) {
        console.error("Update tenant error:", error);

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
        const tenant = await Tenant.findByIdAndDelete(
            req.params.id
        );

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found"
            });
        }

        // Clear Redis cache
        await redisClient.del("tenants:all");

        res.status(200).json({
            success: true,
            message: "Tenant deleted successfully"
        });

    } catch (error) {
        console.error("Delete tenant error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// GET COMPANY PROFILE
// ========================================

const getCompanyProfile = async (req, res) => {
    try {
        const tenant = await Tenant.findById(
            req.user.tenantId
        );

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            success: true,
            data: tenant
        });

    } catch (error) {
        console.error("Get company profile error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// UPDATE COMPANY PROFILE
// ========================================

const updateCompanyProfile = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            website
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }

        const tenant = await Tenant.findById(
            req.user.tenantId
        );

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        tenant.name = name;

        if (email !== undefined) {
            tenant.email = email;
        }

        if (phone !== undefined) {
            tenant.phone = phone;
        }

        if (address !== undefined) {
            tenant.address = address;
        }

        if (website !== undefined) {
            tenant.website = website;
        }

        await tenant.save();

        // Clear Redis cache
        await redisClient.del("tenants:all");

        res.status(200).json({
            success: true,
            message: "Company profile updated successfully",
            data: tenant
        });

    } catch (error) {
        console.error("Update company profile error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
    getTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant,
    getCompanyProfile,
    updateCompanyProfile
};
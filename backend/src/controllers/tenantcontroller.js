const Tenant = require("../models/tenant");


// GET COMPANY PROFILE
const getCompanyProfile = async(req, res) => {
    try {
        const tenant = await Tenant.findById(req.user.tenantId);

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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE COMPANY PROFILE
const updateCompanyProfile = async(req, res) => {
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

        const tenant = await Tenant.findById(req.user.tenantId);

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        tenant.name = name;
        tenant.email = email;
        tenant.phone = phone;
        tenant.address = address;
        tenant.website = website;

        await tenant.save();

        res.status(200).json({
            success: true,
            message: "Company profile updated successfully",
            data: tenant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getCompanyProfile,
    updateCompanyProfile
};
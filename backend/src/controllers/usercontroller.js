const bcrypt = require("bcryptjs");
const User = require("../models/user");


// CREATE USER
const createUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            tenantId: req.user.tenantId,
            role: "user"
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                tenantId: user.tenantId,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL USERS
const getUsers = async(req, res) => {
    try {
        const users = await User.find({
                tenantId: req.user.tenantId
            })
            .select("-password")
            .populate("tenantId", "name");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message  // jgjjcd
        });
    }
};


// GET LOGGED-IN USER PROFILE
const getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password")
            .populate("tenantId", "name");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE LOGGED-IN USER PROFILE
const updateProfile = async(req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.user.userId }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.name = name;
        user.email = email;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                tenantId: user.tenantId,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createUser,
    getUsers,
    getProfile,
    updateProfile
};
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const createUser = async (req, res) => {
    try {
        // Only admin can create employees
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create users"
            });
        }

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

            // IMPORTANT:
            // employee gets the admin's company
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
const getUsers = async (req, res) => {
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
            message: error.message
        });
    }
};
module.exports = {
    createUser,getUsers
};
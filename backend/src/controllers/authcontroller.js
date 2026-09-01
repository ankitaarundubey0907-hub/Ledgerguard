const { registerUser , loginUser } = require("../services/authservices");

const register = async (req, res) => {
    try {
        const { companyName, name, email, password } = req.body;

        if (!companyName || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const result = await registerUser({
            companyName,
            name,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: "Company and admin user registered successfully",
            data: {
                tenant: result.tenant,
                user: {
                    id: result.user._id,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role,
                    tenantId: result.user.tenantId
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const result = await loginUser({
            email,
            password
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: {
                    id: result.user._id,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role,
                    tenantId: result.user.tenantId
                }
            }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,login
};
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("AUTH HEADER EXISTS:", !!authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("NO BEARER TOKEN");
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("JWT VALID");

        req.user = decoded;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error.name, error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
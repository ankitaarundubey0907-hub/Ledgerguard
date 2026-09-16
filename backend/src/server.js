require("dotenv").config();

console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);

const { connectRedis } = require("./config/redis");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const transactionRoutes = require("./routes/transactionroutes");
const userRoutes = require("./routes/userroutes");
const employeeRoutes = require("./routes/employeeroutes");
const paymentRoutes = require("./routes/paymentroutes");
const subscriptionRoutes = require("./routes/subscriptionroutes");
const auditLogRoutes = require("./routes/auditlogroutes");
const tenantRoutes = require("./routes/tenantroutes");

const cors = require("cors");

// dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/tenants", tenantRoutes);

// Connect Database
connectDB();
//connect redis
connectRedis();

// Health Check
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "LedgerGuard backend is running"
    });
});

const port = process.env.port || 5000;

app.listen(port, () => {
    console.log(`LedgerGuard server running on port ${port}`);
});
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authroutes");
const transactionRoutes = require("./routes/transactionroutes");
const userRoutes = require("./routes/userroutes");
const employeeRoutes = require("./routes/employeeroutes");
const tenantRoutes = require("./routes/tenantroutes");

const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const {
    apiLimiter
} = require("./middleware/ratelimitmiddleware");

const errorMiddleware = require("./middleware/errormiddleware");

const swaggerSpec = require("./swagger");

dotenv.config();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Make Socket.IO available to controllers
app.set("io", io);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// General API Rate Limiting
app.use(apiLimiter);

// Swagger API Documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tenants", tenantRoutes);

// Health Check
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "LedgerGuard backend is running"
    });
});

// Centralized Error Handling
app.use(errorMiddleware);

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const tenantId = socket.handshake.auth.tenantId;

    if (tenantId) {
        socket.join(`tenant:${tenantId}`);

        console.log(
            `Socket joined tenant room: tenant:${tenantId}`
        );
    } else {
        console.log(
            "No tenantId provided for socket:",
            socket.id
        );
    }

    socket.on("disconnect", () => {
        console.log(
            "Socket disconnected:",
            socket.id
        );
    });
});

// Connect Database
connectDB();

const port = process.env.port || 5000;

server.listen(port, () => {
    console.log(
        `LedgerGuard server running on port ${port}`
    );
});
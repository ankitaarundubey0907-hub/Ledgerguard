const express = require("express");

const {
    createEmployee,
    getEmployees
} = require("../controllers/employeecontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", authMiddleware, createEmployee);

router.get("/", authMiddleware, getEmployees);

module.exports = router;
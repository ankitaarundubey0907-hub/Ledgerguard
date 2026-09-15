const express = require("express");

const {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeecontroller");

const authMiddleware = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createEmployee
);

router.get(
    "/",
    authMiddleware,
    getEmployees
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateEmployee
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteEmployee
);

module.exports = router;
const express = require("express");

const {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeecontroller");

const authMiddleware = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const validateRequest = require("../middleware/validationmiddleware");

const {
    body
} = require("express-validator");

const router = express.Router();


// CREATE EMPLOYEE
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"), [
        body("name")
        .trim()
        .notEmpty()
        .withMessage("Employee name is required"),

        body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid employee email"),

        body("role")
        .trim()
        .notEmpty()
        .withMessage("Employee role is required"),

        body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required"),

        body("salary")
        .optional()
        .isNumeric()
        .withMessage("Salary must be a number")
    ],
    validateRequest,
    createEmployee
);


// GET / SEARCH / FILTER EMPLOYEES
router.get(
    "/",
    authMiddleware,
    getEmployees
);


// UPDATE EMPLOYEE
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"), [
        body("name")
        .trim()
        .notEmpty()
        .withMessage("Employee name is required"),

        body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid employee email"),

        body("role")
        .trim()
        .notEmpty()
        .withMessage("Employee role is required"),

        body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required"),

        body("salary")
        .optional()
        .isNumeric()
        .withMessage("Salary must be a number")
    ],
    validateRequest,
    updateEmployee
);


// DELETE EMPLOYEE
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteEmployee
);


module.exports = router;
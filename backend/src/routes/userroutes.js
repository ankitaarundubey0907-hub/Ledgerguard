const express = require("express");

const {
    createUser,
    getUsers
} = require("../controllers/usercontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", authMiddleware, createUser);

router.get("/", authMiddleware, getUsers);

module.exports = router;
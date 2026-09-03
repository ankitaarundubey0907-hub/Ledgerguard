const express = require("express");

const {
    createUser
} = require("../controllers/usercontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createUser
);

module.exports = router;
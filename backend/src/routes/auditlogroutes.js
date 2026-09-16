const express = require("express");

const {
    getAuditLogs
} = require("../controllers/auditlogcontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getAuditLogs
);

module.exports = router;
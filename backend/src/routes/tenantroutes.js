const express = require("express");

const {
    getCompanyProfile,
    updateCompanyProfile
} = require("../controllers/tenantcontroller");

const authMiddleware = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    getCompanyProfile
);

router.put(
    "/profile",
    authMiddleware,
    authorizeRoles("admin"),
    updateCompanyProfile
);

module.exports = router;
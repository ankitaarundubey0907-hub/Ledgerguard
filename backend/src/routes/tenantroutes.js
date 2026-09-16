const express = require("express");

const {
    getCompanyProfile,
    updateCompanyProfile,
    getTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant
} = require("../controllers/tenantcontroller");

const authMiddleware = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const router = express.Router();



router.get(
    "/profile",
    authMiddleware,
    getCompanyProfile
);

// Update logged-in user's company profile
router.put(
    "/profile",
    authMiddleware,
    authorizeRoles("admin"),
    updateCompanyProfile
);



router.get(
    "/",
    authMiddleware,
    getTenants
);

// Get single tenant
router.get(
    "/:id",
    authMiddleware,
    getTenant
);

// Create tenant
router.post(
    "/",
    authMiddleware,
    createTenant
);

// Update tenant
router.put(
    "/:id",
    authMiddleware,
    updateTenant
);

// Delete tenant
router.delete(
    "/:id",
    authMiddleware,
    deleteTenant
);


module.exports = router;
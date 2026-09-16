const express = require("express");

const {
    getTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant
} = require("../controllers/tenantcontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();


// Get all tenants
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
const express = require("express");

const {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
} = require("../controllers/invoicecontroller");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// Create Invoice
router.post(
    "/",
    authMiddleware,
    createInvoice
);

// Get all Invoices
router.get(
    "/",
    authMiddleware,
    getInvoices
);

// Get single Invoice
router.get(
    "/:id",
    authMiddleware,
    getInvoiceById
);

// Update Invoice
router.patch(
    "/:id",
    authMiddleware,
    updateInvoice
);

// Delete Invoice
router.delete(
    "/:id",
    authMiddleware,
    deleteInvoice
);

module.exports = router;
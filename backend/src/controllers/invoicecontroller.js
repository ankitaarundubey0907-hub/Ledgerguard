const Invoice = require("../models/invoice");

// Create Invoice
const createInvoice = async(req, res, next) => {
    try {
        const {
            invoiceNumber,
            customerName,
            customerEmail,
            amount,
            status,
            dueDate,
            description
        } = req.body;

        if (!invoiceNumber ||
            !customerName ||
            amount === undefined ||
            !dueDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Invoice number, customer name, amount and due date are required"
            });
        }

        const existingInvoice = await Invoice.findOne({
            invoiceNumber,
            tenantId: req.user.tenantId
        });

        if (existingInvoice) {
            return res.status(400).json({
                success: false,
                message: "Invoice number already exists"
            });
        }

        const invoice = await Invoice.create({
            invoiceNumber,
            tenantId: req.user.tenantId,
            customerName,
            customerEmail,
            amount,
            status,
            dueDate,
            description,
            createdBy: req.user._id
        });

        const io = req.app.get("io");

        if (io && req.user.tenantId) {
            io.to("tenant:" + req.user.tenantId).emit(
                "invoiceCreated",
                invoice
            );
        }

        res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            invoice
        });
    } catch (error) {
        next(error);
    }
};


// Get all invoices
const getInvoices = async(req, res, next) => {
    try {
        const invoices = await Invoice.find({
                tenantId: req.user.tenantId
            })
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            invoices
        });
    } catch (error) {
        next(error);
    }
};


// Get single invoice
const getInvoiceById = async(req, res, next) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            tenantId: req.user.tenantId
        }).populate("createdBy", "name email");

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        res.status(200).json({
            success: true,
            invoice
        });
    } catch (error) {
        next(error);
    }
};


// Update invoice
const updateInvoice = async(req, res, next) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            tenantId: req.user.tenantId
        });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        const allowedFields = [
            "customerName",
            "customerEmail",
            "amount",
            "status",
            "dueDate",
            "description"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                invoice[field] = req.body[field];
            }
        });

        await invoice.save();

        const io = req.app.get("io");

        if (io && req.user.tenantId) {
            io.to("tenant:" + req.user.tenantId).emit(
                "invoiceUpdated",
                invoice
            );
        }

        res.status(200).json({
            success: true,
            message: "Invoice updated successfully",
            invoice
        });
    } catch (error) {
        next(error);
    }
};


// Delete invoice
const deleteInvoice = async(req, res, next) => {
    try {
        const invoice = await Invoice.findOneAndDelete({
            _id: req.params.id,
            tenantId: req.user.tenantId
        });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        const io = req.app.get("io");

        if (io && req.user.tenantId) {
            io.to("tenant:" + req.user.tenantId).emit(
                "invoiceDeleted",
                invoice
            );
        }

        res.status(200).json({
            success: true,
            message: "Invoice deleted successfully",
            invoice
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
};
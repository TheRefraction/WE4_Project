"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const invoice_service_1 = require("../services/invoice.service");
const invoiceService = new invoice_service_1.InvoiceService();
class InvoiceController {
    create = async (req, res, next) => {
        try {
            const invoiceData = req.body;
            const createdInvoice = await invoiceService.createInvoice(invoiceData);
            res.status(201).json({
                success: true,
                message: "Invoice created successfully",
                data: {
                    id: createdInvoice.id
                }
            });
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const invoiceId = parseInt(req.params.id);
            const fullInvoice = await invoiceService.getInvoiceData(invoiceId);
            res.status(200).json({
                success: true,
                data: fullInvoice
            });
        }
        catch (error) {
            next(error);
        }
    };
    getAll = async (req, res, next) => {
        try {
            const invoices = await invoiceService.getAllInvoices();
            res.status(200).json({
                success: true,
                message: "Invoices retrieved successfully",
                data: invoices
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateStatus = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const { status } = req.body;
            await invoiceService.updateInvoiceStatus(id, status);
            res.status(200).json({
                success: true,
                message: "Invoice status updated successfully"
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.InvoiceController = InvoiceController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const invoice_repository_1 = require("../repositories/invoice.repository");
class InvoiceService {
    invoiceRepository;
    constructor() {
        this.invoiceRepository = new invoice_repository_1.InvoiceRepository();
    }
    async createInvoice(invoiceData) {
        const { items } = invoiceData;
        if (!items || items.length === 0) {
            throw new Error(" Can't create invoice because cart is empty");
        }
        return await this.invoiceRepository.createInvoiceWithItems(invoiceData);
    }
    async getInvoiceData(invoiceId) {
        if (!invoiceId) {
            throw new Error("invoice ID is required");
        }
        const fullInvoice = await this.invoiceRepository.findInvoiceWithDetails(invoiceId);
        if (!fullInvoice) {
            throw new Error("Invoice not found");
        }
        return fullInvoice;
    }
    async getAllInvoices() {
        const invoices = await this.invoiceRepository.findAllInvoices();
        return Promise.all(invoices.map(async (invoice) => {
            const details = await this.invoiceRepository.findInvoiceWithDetails(invoice.id);
            return details;
        }));
    }
    async updateInvoiceStatus(invoiceId, status) {
        if (!invoiceId) {
            throw new Error("invoice ID is required");
        }
        return await this.invoiceRepository.updateInvoiceStatus(invoiceId, status);
    }
}
exports.InvoiceService = InvoiceService;

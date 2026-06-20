"use strict";
/**
 * payment.service.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const payment_repository_1 = require("../repositories/payment.repository");
const payment_model_1 = require("../models/payment.model");
class PaymentService {
    repository;
    constructor() {
        this.repository = new payment_repository_1.PaymentRepository();
    }
    async getAllAccounts() {
        const res = await this.repository.findAll();
        return Promise.all(res.map((payment) => this.mapToResponse(payment)));
    }
    async getAccountById(id) {
        const payment = await this.repository.findById(id);
        if (!payment)
            throw new error_middleware_1.AppError('Payment not found', 404);
        return this.mapToResponse(payment);
    }
    async create(data) {
        let dbMode = data.mode;
        if (data.mode === 'card') {
            dbMode = 'credit_card';
        }
        const payment = await this.repository.create({
            mode: dbMode,
            status: data.status || 'paid',
            paymentDate: data.paymentDate || new Date()
        });
        if (data.invoiceId) {
            await this.repository.linkInvoice(data.invoiceId, payment.id, 'paid');
        }
        const paymentResponse = await this.mapToResponse(payment);
        return {
            payment: paymentResponse
        };
    }
    async update(id, data) {
        const payment = await this.repository.findById(id);
        if (!payment) {
            throw new error_middleware_1.AppError('Payment not found', 404);
        }
        if (data.mode !== undefined) {
            if (!Object.values(payment_model_1.PaymentMode).includes(data.mode)) {
                throw new error_middleware_1.AppError('Invalid mode value', 400);
            }
        }
        if (data.status !== undefined) {
            if (!Object.values(payment_model_1.PaymentStatus).includes(data.status)) {
                throw new error_middleware_1.AppError('Invalid status value', 400);
            }
        }
        const updatedPayment = await this.repository.update(id, data);
        if (!updatedPayment)
            throw new error_middleware_1.AppError('Failed to update payment', 500);
        return this.mapToResponse(updatedPayment);
    }
    async mapToResponse(payment) {
        return {
            id: payment.id,
            paymentDate: payment.paymentDate || payment.PaymentDate || payment.payment_date,
            mode: payment.mode,
            status: payment.status,
            createdAt: payment.createdAt || payment.CreatedAt || payment.created_at,
            updatedAt: payment.updatedAt || payment.UpdatedAt || payment.updated_at
        };
    }
}
exports.PaymentService = PaymentService;

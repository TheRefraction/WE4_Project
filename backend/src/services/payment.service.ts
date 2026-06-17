/**
 * payment.service.ts
 */

import { AppError } from '../middlewares/error.middleware';

import { PaymentRepository } from '../repositories/payment.repository';
import { CreatePaymentDTO, Payment, PaymentStatus, PaymentMode, UpdatePaymentDTO } from '../models/payment.model';

export class PaymentService {
    private repository : PaymentRepository;

    constructor() {
        this.repository = new PaymentRepository();
    }

    async getAllAccounts(): Promise<Payment[]> {
        const res = await this.repository.findAll();

        return Promise.all(res.map((payment) => this.mapToResponse(payment)));
    }

    async getAccountById(id: number): Promise<Payment | null> {
        const payment = await this.repository.findById(id);
        if (!payment) throw new AppError('Payment not found', 404);

        return this.mapToResponse(payment);
    }

    async create(data: CreatePaymentDTO) {
        const payment = await this.repository.create({
            mode: data.mode
        });

        const paymentResponse = await this.mapToResponse(payment);

        return {
            payment: paymentResponse
        };
    }

    async update(id: number, data: UpdatePaymentDTO) {
        const payment = await this.repository.findById(id);

        if (!payment) {
            throw new AppError('Payment not found', 404);
        }

        if (data.mode !== undefined) {
            if (!Object.values(PaymentMode).includes(data.mode)) {
                throw new AppError('Invalid mode value', 400);
            }
        }

        if (data.status !== undefined) {
            if (!Object.values(PaymentStatus).includes(data.status)) {
                throw new AppError('Invalid status value', 400);
            }
        }

        const updatedPayment = await this.repository.update(id, data);
        if (!updatedPayment) throw new AppError('Failed to update payment', 500);

        return this.mapToResponse(updatedPayment);
    }

    private async mapToResponse(payment: any): Promise<Payment> {
        return {
            id: payment.id,
            paymentDate: payment.paymentDate,
            mode: payment.mode,
            status: payment.status,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt
        };
    }
}
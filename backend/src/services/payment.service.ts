/**
 * payment.service.ts
 */

import { AppError } from '../middlewares/error.middleware';

import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentResponse, CreatePaymentDTO, PaymentStatus, PaymentMode, UpdatePaymentDTO } from '../models/payment.model';
import { HttpStatus } from '../utils/httpStatus';

export class PaymentService {
    constructor(private repository : PaymentRepository) {}

    async getAll(): Promise<PaymentResponse[]> {
        const res = await this.repository.findAll();

        return Promise.all(res.map((payment) => this.mapToResponse(payment)));
    }

    async getById(id: number): Promise<PaymentResponse | null> {
        const payment = await this.repository.findById(id);
        if (!payment) throw new AppError('Payment not found', HttpStatus.NOT_FOUND);

        return this.mapToResponse(payment);
    }

    async create(data: CreatePaymentDTO): Promise<PaymentResponse> {
        const payment: PaymentResponse = await this.repository.create({
            mode: data.mode,
            status: data.status || PaymentStatus.Pending,
            paymentDate: data.paymentDate || new Date()
        });

        return this.mapToResponse(payment);
    }

    async update(id: number, data: UpdatePaymentDTO): Promise<PaymentResponse> {
        const payment = await this.repository.findById(id);
        if (!payment) throw new AppError('Payment not found', HttpStatus.NOT_FOUND);

        if (data.mode !== undefined) {
            if (!Object.values(PaymentMode).includes(data.mode)) {
                throw new AppError('Invalid mode value', HttpStatus.BAD_REQUEST);
            }
        }

        if (data.status !== undefined) {
            if (!Object.values(PaymentStatus).includes(data.status)) {
                throw new AppError('Invalid status value', HttpStatus.BAD_REQUEST);
            }
        }

        const updatedPayment = await this.repository.update(id, data);
        if (!updatedPayment) throw new AppError('Failed to update payment', HttpStatus.INTERNAL_SERVER_ERROR);

        return this.mapToResponse(updatedPayment);
    }

    private async mapToResponse(data: any): Promise<PaymentResponse> {
        return {
            id: data.id,
            mode: data.mode,
            status: data.status,
            paymentDate: data.paymentDate,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
    }
}
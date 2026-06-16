import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentStatus } from '../models/payment.model';

export class PaymentService {
    private paymentRepository = new PaymentRepository();

    async sendPaymentInfo(status?: string): Promise<number> {
        //paid status by default
        const paymentStatus = status || PaymentStatus.PAID;
        return await this.paymentRepository.createPayment(paymentStatus);
    }
}
import { pgPool } from '../config/postgres';

export class PaymentRepository {

    async createPayment(status: string): Promise<number> {
        const query = `
            INSERT INTO payment (payment_date, mode, status)
            VALUES (NOW(), 'credit_card', $1)
            RETURNING id;
        `;
        const result = await pgPool.query(query, [status]);
        return result.rows[0].id;
    }
}
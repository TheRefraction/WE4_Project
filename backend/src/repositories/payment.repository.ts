import { pgPool } from '../config/postgres';
import { Payment, UpdatePaymentDTO } from '../models/payment.model'

export class PaymentRepository {
    async findAll(): Promise<Payment[]> {
        let query = `
            SELECT  
                id, 
                payment_date AS "PaymentDate",
                mode, 
                status,
                created_at AS "CreatedAt",
                updated_at AS "UpdatedAt"
            FROM payment
        `;

        const res = await pgPool.query(query, []);
        return res.rows || [];
    }

    async findById(id: number): Promise<Payment | null> {
        const query = `
            SELECT 
                id, 
                payment_date AS "PaymentDate",
                mode, 
                status,
                created_at AS "CreatedAt",
                updated_at AS "UpdatedAt"
            FROM payment 
            WHERE id = $1
        `;

        const res = await pgPool.query(query, [id]);
        return res.rows[0] || null;
    }

    async create(data: Omit<Payment, 'id' | 'paymentDate' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
        const {
            mode
        } = data;

        const res = await pgPool.query(
        `
            INSERT INTO payment (mode)
            VALUES ($1)
            RETURNING *;
        `, 
            [mode]
        );

        return res.rows[0];
    }

    async update(id: number, data: UpdatePaymentDTO): Promise<Payment | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;
    
        if (data.paymentDate !== undefined) {
            fields.push(`payment_date = $${paramCount++}`);
            values.push(data.paymentDate);
        }

        if (data.mode !== undefined) {
            fields.push(`mode = $${paramCount++}`);
            values.push(data.mode);
        }

        if (data.status !== undefined) {
            fields.push(`status = $${paramCount++}`);
            values.push(data.status);
        }

        // No update
        if (fields.length === 0) return this.findById(id);

        values.push(id);
        const res = await pgPool.query(
            `
                UPDATE payment SET ${fields.join(', ')} 
                WHERE id = $${paramCount} 
                RETURNING *
            `, 
                values
        );

        return res.rows[0] || null;
    }
}
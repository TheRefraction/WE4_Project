import { pgPool } from '../config/postgres';
import { PaymentResponse, CreatePaymentDTO, UpdatePaymentDTO } from '../models/payment.model'

const SELECT_FIELDS = `
    id, 
    payment_date AS "PaymentDate",
    mode, 
    status,
    created_at AS "CreatedAt",
    updated_at AS "UpdatedAt"   
`;

const RETURN_FIELDS = `
    id, 
    payment_date AS "PaymentDate",
    mode, 
    status,
    created_at AS "CreatedAt",
    updated_at AS "UpdatedAt"   
`;

export class PaymentRepository {
    async findAll(): Promise<PaymentResponse[]> {
        let query = `
            SELECT ${SELECT_FIELDS}
            FROM payment
        `;

        const res = await pgPool.query(query, []);
        return res.rows || [];
    }

    async findById(id: number): Promise<PaymentResponse | null> {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM payment 
            WHERE id = $1
        `;

        const res = await pgPool.query(query, [id]);
        const pay: PaymentResponse = res.rows[0];
        if (!pay) {
            return null;
        }

        return pay;
    }

    async create(data: CreatePaymentDTO): Promise<PaymentResponse> {
        const mode = data.mode;
        const status = data.status || 'paid';
        const paymentDate = data.paymentDate || new Date();

        const res = await pgPool.query(
            `
                INSERT INTO payment (mode, status, payment_date)
                VALUES ($1, $2, $3)
                RETURNING ${RETURN_FIELDS};
            `, 
            [mode, status, paymentDate]
        );

        return res.rows[0];
    }

    async update(id: number, data: UpdatePaymentDTO): Promise<PaymentResponse | null> {
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
                RETURNING ${RETURN_FIELDS}
            `, 
                values
        );

        if (!res.rows[0]) {
            return null;
        }
        
        const pay : PaymentResponse = res.rows[0];

        return pay;
    }

    // No delete operation
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const postgres_1 = require("../config/postgres");
class PaymentRepository {
    async findAll() {
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
        const res = await postgres_1.pgPool.query(query, []);
        return res.rows || [];
    }
    async findById(id) {
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
        const res = await postgres_1.pgPool.query(query, [id]);
        return res.rows[0] || null;
    }
    async create(data) {
        const mode = data.mode;
        const status = data.status || 'paid';
        const paymentDate = data.paymentDate || new Date();
        const res = await postgres_1.pgPool.query(`
                INSERT INTO payment (mode, status, payment_date)
                VALUES ($1, $2, $3)
                RETURNING *;
            `, [mode, status, paymentDate]);
        return res.rows[0];
    }
    async linkInvoice(invoiceId, paymentId, status = 'paid') {
        const query = `
            UPDATE invoice
            SET payment_id = $1, status = $2, updated_at = NOW()
            WHERE id = $3;
        `;
        await postgres_1.pgPool.query(query, [paymentId, status, invoiceId]);
    }
    async update(id, data) {
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
        if (fields.length === 0)
            return this.findById(id);
        values.push(id);
        const res = await postgres_1.pgPool.query(`
                UPDATE payment SET ${fields.join(', ')} 
                WHERE id = $${paramCount} 
                RETURNING *
            `, values);
        return res.rows[0] || null;
    }
}
exports.PaymentRepository = PaymentRepository;

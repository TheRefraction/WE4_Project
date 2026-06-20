"use strict";
/**
 * account.repository.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const postgres_1 = require("../config/postgres");
const SELECT_FIELDS = `
    id, 
    first_name AS "firstName", 
    last_name AS "lastName", 
    email, 
    phone, 
    password_hash AS "passwordHash",
    created_at AS "createdAt",
    updated_at AS "updatedAt", 
    loyalty_points AS "loyaltyPoints", 
    role
`;
const RETURN_FIELDS = `
    id,
    first_name AS "firstName",
    last_name AS "lastName",
    email,
    phone,
    created_at AS "createdAt",
    updated_at AS "updatedAt", 
    loyalty_points AS "loyaltyPoints",
    role
`;
class AccountRepository {
    async findAll(role) {
        let query = `
            SELECT ${SELECT_FIELDS}
            FROM account 
        `;
        const params = [];
        if (role !== undefined) {
            query += ' WHERE role = $${params.length}';
            params.push(role);
        }
        query += ' ORDER BY created_at DESC';
        const res = await postgres_1.pgPool.query(query, []);
        return res.rows || [];
    }
    async findById(id) {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM account 
            WHERE id = $1
        `;
        const res = await postgres_1.pgPool.query(query, [id]);
        if (!res.rows[0]) {
            return null;
        }
        return res.rows[0];
    }
    async findByEmail(email) {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM account 
            WHERE email = $1
        `;
        const res = await postgres_1.pgPool.query(query, [email]);
        if (!res.rows[0]) {
            return null;
        }
        return res.rows[0];
    }
    async create(data) {
        const { firstName, lastName, email, phone, passwordHash, } = data;
        const res = await postgres_1.pgPool.query(`
            INSERT INTO account (first_name, last_name, email, phone, password_hash) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING ${RETURN_FIELDS}
        `, [firstName, lastName, email.toLowerCase(), phone, passwordHash]);
        return res.rows[0];
    }
    async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (data.firstName !== undefined) {
            fields.push(`first_name = $${paramCount++}`);
            values.push(data.firstName);
        }
        if (data.lastName !== undefined) {
            fields.push(`last_name = $${paramCount++}`);
            values.push(data.lastName);
        }
        if (data.email !== undefined) {
            fields.push(`email = $${paramCount++}`);
            values.push(data.email.toLowerCase());
        }
        if (data.phone !== undefined) {
            fields.push(`phone = $${paramCount++}`);
            values.push(data.phone);
        }
        if (data.password !== undefined) {
            fields.push(`password_hash = $${paramCount++}`);
            values.push(data.password);
        }
        if (data.role !== undefined) {
            fields.push(`role = $${paramCount++}`);
            values.push(data.role);
        }
        if (fields.length === 0)
            return this.findById(id);
        values.push(id);
        const res = await postgres_1.pgPool.query(`
                UPDATE account SET ${fields.join(', ')} 
                WHERE id = $${paramCount} 
                RETURNING ${RETURN_FIELDS}
            `, values);
        if (!res.rows[0]) {
            return null;
        }
        return res.rows[0];
    }
    async delete(id) {
        const res = await postgres_1.pgPool.query('DELETE FROM account WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
    }
}
exports.AccountRepository = AccountRepository;

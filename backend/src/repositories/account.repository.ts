/**
 * account.repository.ts
 * 
 * This file defines the AccountRepository class, which provides methods for interacting with the accounts table in the PostgreSQL database.
 * It uses the pgPool from the PostgreSQL configuration to execute SQL queries.
 * The repository provides methods to find accounts by various criteria, create new accounts, update existing accounts, and delete accounts.
 * It abstracts away the database interactions from the service layer, allowing for cleaner and more maintainable code.
 */

import { pgPool } from '../config/postgres';
import { Account, UpdateAccountDTO } from '../models/account.model';

export class AccountRepository {
    async findAll(roleId?: number): Promise<Account[]> {
        let query = `
            SELECT 
                a.id, 
                a.first_name AS "firstName", 
                a.last_name AS "lastName", 
                a.email, 
                a.phone, 
                a.password_hash AS "passwordHash",
                a.created_at AS "createdAt",
                a.updated_at AS "updatedAt", 
                a.loyalty_points AS "loyaltyPoints", 
                r.id AS "roleId"
            FROM account a 
            JOIN role r ON a.role_id = r.id
        `;
        
        const params: any[] = [];

        if (roleId !== undefined) {
            query += ' WHERE role_id = $${params.length}';
            params.push(roleId);
        }

        query += ' ORDER BY created_at DESC';

        const res = await pgPool.query(query, []);
        return res.rows || [];
    }

    async findById(id: number): Promise<Account | null> {
        const query = `
            SELECT 
                a.id, 
                a.first_name AS "firstName", 
                a.last_name AS "lastName", 
                a.email, 
                a.phone, 
                a.password_hash AS "passwordHash",
                a.created_at AS "createdAt",
                a.updated_at AS "updatedAt", 
                a.loyalty_points AS "loyaltyPoints", 
                r.id AS "roleId"
            FROM account a 
            JOIN role r ON a.role_id = r.id
            WHERE a.id = $1
        `;

        const res = await pgPool.query(query, [id]);
        return res.rows[0] || null;
    }

    async findByEmail(email: string): Promise<Account | null> {
        const query = `
            SELECT 
                a.id, 
                a.first_name AS "firstName", 
                a.last_name AS "lastName", 
                a.email, 
                a.phone, 
                a.password_hash AS "passwordHash",
                a.created_at AS "createdAt",
                a.updated_at AS "updatedAt", 
                a.loyalty_points AS "loyaltyPoints", 
                r.id AS "roleId"
            FROM account a 
            JOIN role r ON a.role_id = r.id
            WHERE a.email = $1
        `;

        const res = await pgPool.query(query, [email]);
        return res.rows[0] || null;
    }

    async getRoleById(roleId: number): Promise<string> {
        const query = 'SELECT name FROM role WHERE id = $1';
        
        const res = await pgPool.query(query, [roleId]);
        return res.rows[0]?.name || 'unknown'; 
    }

    async create(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'loyaltyPoints' | 'roleId'>): Promise<Account> {
        const {
            firstName,
            lastName,
            email,
            phone,
            passwordHash,
        } = data;

        const res = await pgPool.query(
        `
            INSERT INTO account (first_name, last_name, email, phone, password_hash) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `,
            [firstName, lastName, email.toLowerCase(), phone, passwordHash]
        );

        return res.rows[0];
    }

    async update(id: number, data: UpdateAccountDTO): Promise<Account | null> {
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

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        const res = await pgPool.query(
            `
                UPDATE account SET ${fields.join(', ')} 
                WHERE id = $${paramCount} 
                RETURNING *
            `, 
                values
        );

        return res.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const res = await pgPool.query('DELETE FROM account WHERE id = $1', [id]);

        return (res.rowCount ?? 0) > 0;
    }
}
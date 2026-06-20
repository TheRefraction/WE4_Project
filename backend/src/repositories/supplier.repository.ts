/**
 * supplier.repository.ts
 */

import { pgPool } from '../config/postgres';
import { SupplierResponse, CreateSupplierDTO, UpdateSupplierDTO } from '../models/supplier.model';

const SELECT_FIELDS = `
    id, 
    name, 
    contact_info AS "contactInfo"
`;

const RETURN_FIELDS = `
    id, 
    name, 
    contact_info AS "contactInfo"
`;

export class SupplierRepository {
    async findAll(): Promise<SupplierResponse[]> {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM supplier
        `;

        const res = await pgPool.query(query);
        return res.rows || [];
    }

    async findById(id: number): Promise<SupplierResponse | null> {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM supplier 
            WHERE id = $1
        `;

        const res = await pgPool.query(query, [id]);
        return res.rows[0] || null;
    }

    async findByName(name: string): Promise<SupplierResponse | null> {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM supplier
            WHERE name = $1
        `;

        const res = await pgPool.query(query, [name]);
        return res.rows[0] || null;
    }

    async create(data: CreateSupplierDTO): Promise<SupplierResponse> {
        const { 
            name, 
            contactInfo
        } = data;

        const query = `
            INSERT INTO supplier (name, contact_info) 
            VALUES ($1, $2) 
            RETURNING ${RETURN_FIELDS}
        `;

        const res = await pgPool.query(query, [name, JSON.stringify(contactInfo)]);
        const supplier : SupplierResponse = res.rows[0];

        return supplier;
    }

    async update(id: number, data: UpdateSupplierDTO): Promise<SupplierResponse | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (data.name !== undefined) {
            fields.push(`name = $${paramCount++}`);
            values.push(data.name);
        }

        if (data.contactInfo !== undefined) {
            fields.push(`contact_info = $${paramCount++}`);
            values.push(JSON.stringify(data.contactInfo));
        }

        if (fields.length === 0) return this.findById(id);
        values.push(id);

        const query = `
            UPDATE supplier SET ${fields.join(', ')} 
            WHERE id = $${paramCount} 
            RETURNING ${RETURN_FIELDS}
        `;

        const res = await pgPool.query(query, values);
        const supplier : SupplierResponse = res.rows[0];

        return supplier || null;
    }

    async delete(id: number): Promise<boolean> {
        const res = await pgPool.query('DELETE FROM supplier WHERE id = $1', [id]);

        return (res.rowCount ?? 0) > 0;
    }

    async countDependencies(supplierId: number): Promise<number> {
        const query = `
            SELECT COALESCE(COUNT(*)::int, 0) 
            FROM product 
            WHERE supplier_id = $1
        `;

        const res = await pgPool.query(query, [supplierId]);

        return res.rows[0]?.count || 0;
    }
}
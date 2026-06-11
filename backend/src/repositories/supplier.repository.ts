import { pgPool } from '../config/postgres';
import { Supplier, UpdateSupplierDTO } from '../models/supplier.model';

export class SupplierRepository {
    
    async findAll(): Promise<any[]> {
        const query = `
            SELECT 
                s.id, 
                s.name, 
                s.contact_info AS "contactInfo", 
                COUNT(p.id)::int AS "productCount"
            FROM supplier s
            LEFT JOIN product p ON s.id = p.supplier_id
            GROUP BY s.id
            ORDER BY s.name ASC
        `;
        const res = await pgPool.query(query);
        return res.rows || [];
    }

    async findById(id: number): Promise<Supplier | null> {
        const query = `
            SELECT id, name, contact_info AS "contactInfo" 
            FROM supplier 
            WHERE id = $1
        `;
        const res = await pgPool.query(query, [id]);
        return res.rows[0] || null;
    }

    async findByName(name: string): Promise<Supplier | null> {
        const query = `
            SELECT id, name, contact_info AS "contactInfo" 
            FROM supplier 
            WHERE name = $1
        `;
        const res = await pgPool.query(query, [name]);
        return res.rows[0] || null;
    }

    async create(data: Omit<Supplier, 'id'>): Promise<Supplier> {
        const { name, contactInfo } = data;
        const query = `
            INSERT INTO supplier (name, contact_info) 
            VALUES ($1, $2) 
            RETURNING id, name, contact_info AS "contactInfo"
        `;
        const res = await pgPool.query(query, [name, JSON.stringify(contactInfo)]);
        return res.rows[0];
    }

    async update(id: number, data: UpdateSupplierDTO): Promise<Supplier | null> {
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
            RETURNING id, name, contact_info AS "contactInfo"
        `;
        const res = await pgPool.query(query, values);
        return res.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const res = await pgPool.query('DELETE FROM supplier WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
    }

    async countDependencies(supplierId: number): Promise<number> {
        const query = 'SELECT COUNT(*)::int FROM product WHERE supplier_id = $1';
        const res = await pgPool.query(query, [supplierId]);
        return res.rows[0]?.count || 0;
    }
}
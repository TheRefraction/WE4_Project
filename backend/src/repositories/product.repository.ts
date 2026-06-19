/**
 * product.repository.ts
 */

import { pgPool } from '../config/postgres';
import { ProductResponse, CreateProductDTO, UpdateProductDTO } from '../models/product.model';

const SELECT_FIELDS = `
    id, 
    name, 
    description, 
    price, 
    supplier_id AS "supplierId", 
    hidden
`;

const RETURN_FIELDS = `
    id, 
    name,
    description,
    price,
    supplier_id AS "supplierId",
    hidden
`;

export class ProductRepository {
    async findAll(showHidden = true): Promise<ProductResponse[]> {
        let query = `
            SELECT ${SELECT_FIELDS}
            FROM product
        `;

        if (!showHidden) {
            query += ' WHERE hidden = FALSE'; 
        }
        
        const res = await pgPool.query(query, []);
        return res.rows || [];
    }

    async findById(id: number): Promise<ProductResponse | null> {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM product
            WHERE id = $1
        `;

        const res = await pgPool.query(query, [id]);

        if (!res.rows[0]) {
            return null;
        }

        const product : ProductResponse = res.rows[0];

        return product;
    }

    async create(data: CreateProductDTO): Promise<ProductResponse> {
        const {
            name,
            description,
            price,
            supplierId,
            hidden
        } = data;

        const query = `
            INSERT INTO product (name, description, price, supplier_id, hidden)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING ${RETURN_FIELDS}
        `;

        const res = await pgPool.query(query, [name, description, price, supplierId, hidden]);
        const product : ProductResponse = res.rows[0];

        return product;
    }

    async update(id: number, data: UpdateProductDTO): Promise<ProductResponse | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (data.name !== undefined) {
            fields.push(`name = $${paramCount++}`);
            values.push(data.name);
        }

        if (data.description !== undefined) {
            fields.push(`description = $${paramCount++}`);
            values.push(data.description);
        }

        if (data.price !== undefined) {
            fields.push(`price = $${paramCount++}`);
            values.push(data.price);
        }

        if (data.supplierId !== undefined) {
            fields.push(`supplier_id = $${paramCount++}`);
            values.push(data.supplierId);
        }

        if (data.hidden !== undefined) {
            fields.push(`hidden = $${paramCount++}`);
            values.push(data.hidden);
        }

        if (fields.length === 0) return this.findById(id);
        values.push(id);

        const query = `
            UPDATE product SET ${fields.join(', ')} 
            WHERE id = $${paramCount}
            RETURNING ${RETURN_FIELDS}
        `;

        const res = await pgPool.query(query, values);

        if (!res.rows[0]) {
            return null;
        }

        const product : ProductResponse = res.rows[0];

        return product;
    }

    async delete(id: number): Promise<boolean> {
        const res = await pgPool.query(`DELETE FROM product WHERE id = $1`, [id]);
        return (res.rowCount ?? 0) > 0;
    }
}
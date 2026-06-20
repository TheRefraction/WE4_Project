"use strict";
/**
 * product.repository.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const postgres_1 = require("../config/postgres");
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
class ProductRepository {
    async findAll(showHidden = true) {
        let query = `
            SELECT ${SELECT_FIELDS}
            FROM product
        `;
        if (!showHidden) {
            query += ' WHERE hidden = FALSE';
        }
        const res = await postgres_1.pgPool.query(query, []);
        return res.rows || [];
    }
    async findById(id) {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM product
            WHERE id = $1
        `;
        const res = await postgres_1.pgPool.query(query, [id]);
        if (!res.rows[0]) {
            return null;
        }
        const product = res.rows[0];
        return product;
    }
    async create(data) {
        const client = await postgres_1.pgPool.connect();
        try {
            await client.query('BEGIN');
            const { name, description, price, supplierId, hidden, categoryIds } = data;
            const query = `
                INSERT INTO product (name, description, price, supplier_id, hidden)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING ${RETURN_FIELDS}
            `;
            const res = await client.query(query, [name, description, price, supplierId, hidden]);
            const product = res.rows[0];
            if (categoryIds && categoryIds.length > 0) {
                for (const catId of categoryIds) {
                    await client.query('INSERT INTO product_category (product_id, category_id) VALUES ($1, $2)', [product.id, catId]);
                }
            }
            await client.query('COMMIT');
            return product;
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    }
    async update(id, data) {
        const client = await postgres_1.pgPool.connect();
        try {
            await client.query('BEGIN');
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
            let product = null;
            if (fields.length > 0) {
                values.push(id);
                const query = `
                    UPDATE product SET ${fields.join(', ')} 
                    WHERE id = $${paramCount}
                    RETURNING ${RETURN_FIELDS}
                `;
                const res = await client.query(query, values);
                product = res.rows[0] || null;
            }
            else {
                const res = await client.query(`SELECT ${SELECT_FIELDS} FROM product WHERE id = $1`, [id]);
                product = res.rows[0] || null;
            }
            if (data.categoryIds !== undefined) {
                await client.query('DELETE FROM product_category WHERE product_id = $1', [id]);
                for (const catId of data.categoryIds) {
                    await client.query('INSERT INTO product_category (product_id, category_id) VALUES ($1, $2)', [id, catId]);
                }
            }
            await client.query('COMMIT');
            return product;
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    }
    async delete(id) {
        const res = await postgres_1.pgPool.query(`DELETE FROM product WHERE id = $1`, [id]);
        return (res.rowCount ?? 0) > 0;
    }
}
exports.ProductRepository = ProductRepository;

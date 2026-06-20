"use strict";
/**
 * customization.repository.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomizationSlotRepository = void 0;
const postgres_1 = require("../config/postgres");
const SELECT_FIELDS = `
    cs.id,
    cs.product_id AS "productId",
    cs.category_id AS "categoryId",
    c.name AS "categoryName",
    cs.min_select AS "minSelect",
    cs.max_select AS "maxSelect",
    cs.display_order AS "displayOrder"
`;
const RETURN_FIELDS = `
    id, 
    product_id AS "productId", 
    category_id AS "categoryId", 
    min_select AS "minSelect", 
    max_select AS "maxSelect", 
    display_order AS "displayOrder"
`;
class CustomizationSlotRepository {
    async findAll() {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM customization_slot cs
            LEFT JOIN category c ON cs.category_id = c.id
            ORDER BY cs.display_order
        `;
        const res = await postgres_1.pgPool.query(query);
        const slots = res.rows;
        return slots || [];
    }
    async findAllByProductId(productId) {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM customization_slot cs
            LEFT JOIN category c ON cs.category_id = c.id
            WHERE cs.product_id = $1
            ORDER BY cs.display_order
        `;
        const res = await postgres_1.pgPool.query(query, [productId]);
        const slots = res.rows;
        return slots || [];
    }
    async findById(id) {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM customization_slot cs
            LEFT JOIN category c ON cs.category_id = c.id
            WHERE cs.id = $1
        `;
        const res = await postgres_1.pgPool.query(query, [id]);
        if (!res.rows[0]) {
            return null;
        }
        const slot = res.rows[0];
        return slot;
    }
    async findByProductAndCategory(productId, categoryId) {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM customization_slot cs
            LEFT JOIN category c ON cs.category_id = c.id
            WHERE cs.product_id = $1 AND cs.category_id = $2
        `;
        const res = await postgres_1.pgPool.query(query, [productId, categoryId]);
        if (!res.rows[0]) {
            return null;
        }
        const slot = res.rows[0];
        return slot;
    }
    async create(data) {
        const { productId, categoryId, minSelect, maxSelect, displayOrder } = data;
        const query = `
            INSERT INTO customization_slot (product_id, category_id, min_select, max_select, display_order)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING ${RETURN_FIELDS}
        `;
        const res = await postgres_1.pgPool.query(query, [productId, categoryId, minSelect, maxSelect, displayOrder]);
        const slot = res.rows[0];
        return slot;
    }
    async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (data.productId !== undefined) {
            fields.push(`product_id = $${paramCount++}`);
            values.push(data.productId);
        }
        if (data.categoryId !== undefined) {
            fields.push(`category_id = $${paramCount++}`);
            values.push(data.categoryId);
        }
        if (data.minSelect !== undefined) {
            fields.push(`min_select = $${paramCount++}`);
            values.push(data.minSelect);
        }
        if (data.maxSelect !== undefined) {
            fields.push(`max_select = $${paramCount++}`);
            values.push(data.maxSelect);
        }
        if (data.displayOrder !== undefined) {
            fields.push(`display_order = $${paramCount++}`);
            values.push(data.displayOrder);
        }
        if (fields.length === 0)
            return this.findById(id);
        values.push(id);
        const query = `
            UPDATE customization_slot SET ${fields.join(', ')} 
            WHERE id = $${paramCount}
            RETURNING ${RETURN_FIELDS}
        `;
        const res = await postgres_1.pgPool.query(query, values);
        if (!res.rows[0]) {
            return null;
        }
        const slot = res.rows[0];
        return slot;
    }
    async delete(id) {
        const res = await postgres_1.pgPool.query('DELETE FROM customization_slot WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
    }
}
exports.CustomizationSlotRepository = CustomizationSlotRepository;

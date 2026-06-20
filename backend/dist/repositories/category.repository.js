"use strict";
/**
 * category.repository.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const postgres_1 = require("../config/postgres");
const SELECT_FIELDS = `
    c.id, 
    c.name, 
    COALESCE(COUNT(pc.product_id)::int, 0) AS "productCount"
`;
const RETURN_FIELDS = `
    id, 
    name
`;
class CategoryRepository {
    async findAll() {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM category c
            LEFT JOIN product_category pc ON c.id = pc.category_id
            GROUP BY c.id
            ORDER BY c.name ASC
        `;
        const res = await postgres_1.pgPool.query(query);
        return res.rows || [];
    }
    async findAllByProductId(productId) {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM category c
            LEFT JOIN product_category pc ON c.id = pc.category_id
            WHERE pc.product_id = $1
            GROUP BY c.id
            ORDER BY c.name ASC
        `;
        const res = await postgres_1.pgPool.query(query, [productId]);
        return res.rows || [];
    }
    async findById(id) {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM category c
            LEFT JOIN product_category pc ON c.id = pc.category_id
            WHERE c.id = $1
            GROUP BY c.id
            ORDER BY c.name ASC
        `;
        const res = await postgres_1.pgPool.query(query, [id]);
        if (!res.rows[0]) {
            return null;
        }
        return res.rows[0];
    }
    async findByName(name) {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM category c
            LEFT JOIN product_category pc ON c.id = pc.category_id
            WHERE LOWER(name) = LOWER($1)
            GROUP BY c.id
            ORDER BY c.name ASC
        `;
        const res = await postgres_1.pgPool.query(query, [name]);
        if (!res.rows[0]) {
            return null;
        }
        return res.rows[0];
    }
    async findCategoryIdsByProductId(productId) {
        const query = `
            SELECT category_id AS "categoryId"
            FROM product_category
            WHERE product_id = $1
        `;
        const res = await postgres_1.pgPool.query(query, [productId]);
        return res.rows.map((row) => row.categoryId);
    }
    async create(data) {
        const query = `
            INSERT INTO category (name) 
            VALUES ($1) 
            RETURNING ${RETURN_FIELDS}
        `;
        const res = await postgres_1.pgPool.query(query, [data.name]);
        const category = res.rows[0];
        return category;
    }
    async update(id, data) {
        const query = `
            UPDATE category 
            SET name = $1 
            WHERE id = $2 
            RETURNING ${RETURN_FIELDS}
        `;
        const res = await postgres_1.pgPool.query(query, [data.name, id]);
        if (!res.rows[0]) {
            return null;
        }
        const category = res.rows[0];
        return category || null;
    }
    async delete(id) {
        const query = 'DELETE FROM category WHERE id = $1';
        const res = await postgres_1.pgPool.query(query, [id]);
        return (res.rowCount ?? 0) > 0;
    }
    async countDependencies(id) {
        const query = `
            SELECT (
                (SELECT COALESCE(COUNT(*)::int, 0) FROM customization_slot WHERE category_id = $1) +
                (SELECT COALESCE(COUNT(*)::int, 0) FROM product_category WHERE category_id = $1)
            ) AS count
        `;
        const res = await postgres_1.pgPool.query(query, [id]);
        return res.rows[0]?.count || 0;
    }
}
exports.CategoryRepository = CategoryRepository;

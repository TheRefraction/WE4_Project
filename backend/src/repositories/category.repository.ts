/**
 * category.repository.ts
 */

import { pgPool } from '../config/postgres';
import { Category, CategoryResponse, CreateCategoryDTO, UpdateCategoryDTO } from '../models/category.model';

export class CategoryRepository {
    async findAll(): Promise<CategoryResponse[]> {
        const query = `
            SELECT 
                c.id, 
                c.name, 
                COALESCE(COUNT(pc.product_id)::int, 0) AS "productCount"
            FROM category c
            LEFT JOIN product_category pc ON c.id = pc.category_id
            GROUP BY c.id
            ORDER BY c.name ASC
        `;

        const res = await pgPool.query(query);
        return res.rows || [];
    }

    async findById(id: number): Promise<CategoryResponse | null> {
        const query = `
            SELECT 
                c.id, 
                c.name, 
                COALESCE(COUNT(pc.product_id)::int, 0) AS "productCount"
            FROM category c
            LEFT JOIN product_category pc ON c.id = pc.category_id
            WHERE c.id = $1
            GROUP BY c.id
            ORDER BY c.name ASC
        `;

        const res = await pgPool.query(query, [id]);
        return res.rows[0] || null;
    }

    async findByName(name: string): Promise<CategoryResponse | null> {
        const query = `
            SELECT 
                c.id, 
                c.name, 
                COALESCE(COUNT(pc.product_id)::int, 0) AS "productCount"
            FROM category c
            LEFT JOIN product_category pc ON c.id = pc.category_id
            WHERE LOWER(name) = LOWER($1)
            GROUP BY c.id
            ORDER BY c.name ASC
        `;

        const res = await pgPool.query(query, [name]);
        return res.rows[0] || null;
    }

    async findCategoryIdsByProductId(productId: number): Promise<number[]> {
        const query = `
            SELECT category_id AS "categoryId"
            FROM product_category
            WHERE product_id = $1
        `;

        const res = await pgPool.query(query, [productId]);
        return res.rows.map((row) => row.categoryId);
    }

    async create(data: CreateCategoryDTO): Promise<CategoryResponse> {
        const query = `
            INSERT INTO category (name) 
            VALUES ($1) 
            RETURNING 
                id, 
                name
        `;

        const res = await pgPool.query(query, [data.name]);
        const category: CategoryResponse = res.rows[0];

        return category;
    }

    async update(id: number, data: UpdateCategoryDTO): Promise<CategoryResponse | null> {
        const query = `
            UPDATE category 
            SET name = $1 
            WHERE id = $2 
            RETURNING 
                id, 
                name
        `;

        const res = await pgPool.query(query, [data.name, id]);
        const category : CategoryResponse = res.rows[0];

        return category || null;
    }

    async delete(id: number): Promise<boolean> {
        const query = 'DELETE FROM category WHERE id = $1';

        const res = await pgPool.query(query, [id]);
        return (res.rowCount ?? 0) > 0;
    }

    async countDependencies(id: number): Promise<number> {
        const query = `
            SELECT (
                (SELECT COALESCE(COUNT(*)::int, 0) FROM customization_slot WHERE category_id = $1) +
                (SELECT COALESCE(COUNT(*)::int, 0) FROM product_category WHERE category_id = $1)
            ) AS count
        `;

        const res = await pgPool.query(query, [id]);
        return res.rows[0]?.count || 0;
    }
}
import { pgPool } from '../config/postgres';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../models/category.model';

export class CategoryRepository {


    async findAll(): Promise<any[]> {
        const query = `
            SELECT 
                c.id, 
                c.name, 
                COUNT(pc.product_id)::int AS "productCount"
            FROM category c
            LEFT JOIN product_category pc ON c.id = pc.category_id
            GROUP BY c.id
            ORDER BY c.name ASC
        `;
        const res = await pgPool.query(query);
        return res.rows || [];
    }


    async findById(id: number): Promise<Category | null> {
        const query = `
            SELECT id, name 
            FROM category 
            WHERE id = $1
        `;
        const res = await pgPool.query(query, [id]);
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


    async findByName(name: string): Promise<Category | null> {
        const query = `
            SELECT id, name 
            FROM category 
            WHERE LOWER(name) = LOWER($1)
        `;
        const res = await pgPool.query(query, [name]);
        return res.rows[0] || null;
    }


    async create(data: CreateCategoryDTO): Promise<Category> {
        const query = `
            INSERT INTO category (name) 
            VALUES ($1) 
            RETURNING id, name
        `;
        const res = await pgPool.query(query, [data.name]);
        return res.rows[0];
    }


    async update(id: number, data: UpdateCategoryDTO): Promise<Category | null> {
        const query = `
            UPDATE category 
            SET name = $1 
            WHERE id = $2 
            RETURNING id, name
        `;
        const res = await pgPool.query(query, [data.name, id]);
        return res.rows[0] || null;
    }


    async delete(id: number): Promise<boolean> {
        const query = 'DELETE FROM category WHERE id = $1';
        const res = await pgPool.query(query, [id]);
        return (res.rowCount ?? 0) > 0;
    }


    async countDependencies(id: number): Promise<number> {
        const query = `
            SELECT (
                (SELECT COUNT(*)::int FROM customization_slot WHERE category_id = $1) +
                (SELECT COUNT(*)::int FROM product_category WHERE category_id = $1)
            ) AS count
        `;
        const res = await pgPool.query(query, [id]);
        return res.rows[0]?.count || 0;
    }
}
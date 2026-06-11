import { pgPool } from '../config/postgres';
import { Product, CreateProductDTO, UpdateProductDTO, ProductResponse } from '../models/product.model';

export class ProductRepository {

    async findAll(showHidden = true): Promise<any[]> {
        let query = `
            SELECT id, name, description, price, supplier_id AS "supplierId", hidden
            FROM product
        `;
        const values: any[] = [];

        if (!showHidden) {
            query += ' WHERE hidden = FALSE'; 
        }
        
        const res = await pgPool.query(query, values);
        return res.rows || [];
    }

    async findAllWithSupplierAndCategories(): Promise<any[]> {
        const query = `
            SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.supplier_id AS "supplierId",
                p.hidden,
                s.name AS "supplierName",
                STRING_AGG(pc.name, ',') AS categories 
            FROM product p
            LEFT JOIN supplier s ON p.supplier_id = s.id 
            LEFT JOIN product_category ptc ON p.id = ptc.product_id
            LEFT JOIN category pc ON ptc.category_id = pc.id
            GROUP BY p.id, s.name
            ORDER BY p.name ASC
        `;
        const res = await pgPool.query(query);
        return res.rows || [];
    }

    async findById(id: number): Promise<any | null> {
        const query = `
            SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.supplier_id AS "supplierId",
                p.hidden,
                pc.name AS "categoryName",
                s.name AS "supplierName"
            FROM product p
            LEFT JOIN supplier s ON p.supplier_id = s.id
            LEFT JOIN product_category ptc ON p.id = ptc.product_id
            LEFT JOIN category pc ON ptc.category_id = pc.id
            WHERE p.id = $1
        `;
        const res = await pgPool.query(query, [id]);
        return res.rows[0] || null;
    }

    async findFiltered(search: string | null, sort: string | null): Promise<any[]> {
        let query = `
            SELECT 
                id,    
                name, 
                description,
                price,
                supplier_id AS "supplierId",
                hidden 
            FROM product 
            WHERE hidden = FALSE
        `;
        const values: any[] = [];

        if (search) {
            values.push(`%${search}%`);
            query += ` AND name ILIKE $${values.length}`; 
        }

        if (sort) {
            if (sort === 'name_desc') query += ' ORDER BY name DESC';
            else if (sort === 'name_asc') query += ' ORDER BY name ASC';
            else if (sort === 'price_asc') query += ' ORDER BY price ASC';
            else if (sort === 'price_desc') query += ' ORDER BY price DESC';
        }

        const res = await pgPool.query(query, values);
        return res.rows || [];
    }

    async findByIdWithSupplier(id: number): Promise<any | null> {
        const query = `
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.supplier_id AS "supplierId",
                p.hidden,
                s.name AS "supplierName"
            FROM product p
            LEFT JOIN supplier s ON p.supplier_id = s.id
            WHERE p.id = $1
        `;
        const res = await pgPool.query(query, [id]);
        return res.rows[0] || null;
    }

    async createWithCategories(data: Omit<CreateProductDTO, 'categoryIds'>, categoryIds: number[]): Promise<ProductResponse> {
        const { name, description, price, supplier_id, hidden } = data;

        const productQuery = `
            INSERT INTO product (name, description, price, supplier_id, hidden)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, description, price, supplier_id AS "supplierId", hidden
        `;
        const productRes = await pgPool.query(productQuery, [
            name,
            description,
            price,
            supplier_id,
            hidden ?? false
        ]);
        const newProduct = productRes.rows[0];
        
        if (categoryIds && categoryIds.length > 0) {
            const linkQuery = `
                INSERT INTO product_category (product_id, category_id) 
                VALUES ($1, $2)
            `;
            for (const categoryId of categoryIds) {
                await pgPool.query(linkQuery, [newProduct.id, categoryId]);
            }
        }
        return newProduct;
    }

    async updateWithCategories(id: number, data: Omit<UpdateProductDTO, 'categoryIds'>, categoryIds: number[]): Promise<ProductResponse | null> {    
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (data.name !== undefined) { fields.push(`name = $${paramCount++}`); values.push(data.name); }
        if (data.description !== undefined) { fields.push(`description = $${paramCount++}`); values.push(data.description); }
        if (data.price !== undefined) { fields.push(`price = $${paramCount++}`); values.push(data.price); }
        if (data.supplier_id !== undefined) { fields.push(`supplier_id = $${paramCount++}`); values.push(data.supplier_id); }
        if (data.hidden !== undefined) { fields.push(`hidden = $${paramCount++}`); values.push(data.hidden); }

        if (fields.length > 0) {
            values.push(id);
            const updateQuery = `UPDATE product SET ${fields.join(', ')} WHERE id = $${paramCount}`;
            await pgPool.query(updateQuery, values);
        } 
        
        if (categoryIds !== undefined) {
            await pgPool.query(`DELETE FROM product_category WHERE product_id = $1`, [id]);

            if (categoryIds.length > 0) {
                const linkQuery = 'INSERT INTO product_category (product_id, category_id) VALUES ($1, $2)';
                for (const categoryId of categoryIds) {
                    await pgPool.query(linkQuery, [id, categoryId]);
                }
            }
        }
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const res = await pgPool.query(`DELETE FROM product WHERE id = $1`, [id]);
        return (res.rowCount ?? 0) > 0;
    }
}
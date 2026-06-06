import pool from '../config/postgres';

export class Product {
    id!: number;
    name!: string;
    description!: string;
    price!: number;
    hidden!: boolean;
    supplier_id!: number;

    constructor(data: any){
        Object.assign(this, data);
    }


    static getAllProducts = async () => {
        const result = await pool.query('SELECT * FROM product WHERE hidden = false');
        return result.rows.map((row: any) => new Product(row));    }   




    static getProductById = async (id: number) => {
        const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Product(result.rows[0]);
    }




    static getAllProductsWithSuppliersAndCategories = async () => {
            const query = `SELECT p.*,
             s.name                         AS supplier_name,
             string_agg(pc.name, ', ')      AS categories
      FROM product p
      LEFT JOIN supplier s                  ON p.supplier_id = s.id
      LEFT JOIN product_to_category ptc     ON p.id = ptc.product_id
      LEFT JOIN product_category pc         ON ptc.category_id = pc.id
      GROUP BY p.id
      ORDER BY p.name ASC;
    `;
    const result = await pool.query(query);
    return result.rows.map((row: any) => new Product(row));
    }



    static getFilteredProducts = async (search?: string, sort?: string) => {
        let query = 'SELECT * FROM product WHERE hidden = false';
        const params: any[] = [];
        if (search){
            params.push(`%${search}%`);
            query += ` AND (name ILIKE $${params.length})`;
        }
        if (sort){
            if (sort === "name_desc") {
                query += ' ORDER BY name DESC';
            } else if (sort === "name_asc") {
                query += ' ORDER BY name ASC';
            } else if (sort === "price_desc") {
                query += ' ORDER BY price DESC';
            } else if (sort === "price_asc") {
                query += ' ORDER BY price ASC';
            }
        }
        const result = await pool.query(query, params);
        return result.rows.map((row: any) => new Product(row));
    }


    static getByIdWithSupplier = async (id: number) => {
        const query = `SELECT p.*, s.name       AS supplier_name
                       FROM product p
                       LEFT JOIN supplier s ON p.supplier_id = s.id
                       WHERE p.id = $1`;

        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Product(result.rows[0]);
    }


    static createProductWithCategories = async (productData: any) => {
        const {name, description, price, hidden, supplier_id, categoryIds } = productData;
        try {
            const query = `INSERT INTO product (name, description, price, hidden, supplier_id)
                            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const produtValues = [name, description, price, hidden, supplier_id];
            const result = await pool.query(query, produtValues);
            const newProduct = result.rows[0];
            if (categoryIds && categoryIds.length > 0) {
                const secondQuery = `
                INSERT INTO product_to_category (product_id, category_id)
                SELECT $1, unnest($2::int[])
                `;
                await pool.query(secondQuery, [newProduct.id, categoryIds]);
            }
            return new Product(newProduct);
        } catch (error) {
            throw error;
        }
    }



    static  updateWithCategories = async (id: number, productData: any) => {
        const {name, description, price, hidden, supplier_id, categoryIds } = productData;
        try {
            const query = `UPDATE product SET name = $1, description = $2, price = $3, hidden = $4, supplier_id = $5
                            WHERE id = $6 RETURNING *`;
            const produtValues = [name, description, price, hidden, supplier_id, id];
            const result = await pool.query(query, produtValues);
            if (result.rows.length === 0) {
                return null;
            }
            await pool.query('DELETE FROM product_to_category WHERE product_id = $1', [id]);
            if (categoryIds && categoryIds.length > 0) {
                const secondQuery = `
                INSERT INTO product_to_category (product_id, category_id)
                SELECT $1, unnest($2::int[])
                `;
                await pool.query(secondQuery, [id, categoryIds]);
            }
            return new Product(result.rows[0]);
        } catch (error) {
            throw error;
        }

    }


    static  delete = async (id: number) => {
        try {
            await pool.query('DELETE FROM product_to_category WHERE product_id = $1', [id]);
            const query = `DELETE FROM product WHERE id = $1 RETURNING *`;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

}
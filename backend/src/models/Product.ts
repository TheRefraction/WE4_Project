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





}

import { pgPool } from '../config/postgres';
import { CustomizationSlot, CustomizationSlotResponse } from '../models/customization.model';

export class CustomizationRepository {
    async findAllSlots(): Promise<CustomizationSlotResponse[]> {
        const query = `
            SELECT 
                cs.id,
                cs.product_id AS "productId",
                cs.category_id AS "categoryId",
                cs.min_select AS "minSelect",
                cs.max_select AS "maxSelect",
                cs.display_order AS "displayOrder",
                p.name AS "productName",
                c.name AS "categoryName"
            FROM customization_slot cs
            LEFT JOIN product p ON cs.product_id = p.id
            LEFT JOIN category c ON cs.category_id = c.id
            ORDER BY p.name, c.name, cs.display_order
        `;

        const res = await pgPool.query(query);
        const slots : CustomizationSlotResponse[] = res.rows;

        return slots || [];
    }

    async findAllWithDetails(): Promise<CustomizationSlotResponse[]> {
        const slots = await this.findAllSlots();
        
        return Promise.all(slots.map(async (slot) => {
            const options = await this.optionRepository.findBySlotId(slot.id);
            
            return {
                ...slot,
                options: options || [] 
            };
        }));
    }

    async findSlotsByProductId(productId: number): Promise<CustomizationSlotResponse[]> {
        const query = `
            SELECT 
                cs.id,
                cs.product_id AS "productId",
                cs.category_id AS "categoryId",
                cs.min_select AS "minSelect",
                cs.max_select AS "maxSelect",
                cs.display_order AS "displayOrder",
                p.name AS "productName",
                c.name AS "categoryName"
            FROM customization_slot cs
            LEFT JOIN product p ON cs.product_id = p.id
            LEFT JOIN category c ON cs.category_id = c.id
            WHERE cs.product_id = $1
            ORDER BY cs.display_order ASC
        `;

        const res = await pgPool.query(query, [productId]);
        const slots : CustomizationSlotResponse[] = res.rows;

        return slots || [];
    }

    async findSlotById(id: number): Promise<any | null> {
        const query = `
            SELECT 
                cs.id,
                cs.product_id AS "productId",
                cs.category_id AS "categoryId",
                cs.min_select AS "minSelect",
                cs.max_select AS "maxSelect",
                cs.display_order AS "displayOrder",
                p.name AS "productName",
                c.name AS "categoryName"
            FROM customization_slot cs
            LEFT JOIN product p ON cs.product_id = p.id
            LEFT JOIN category c ON cs.category_id = c.id
            WHERE cs.id = $1
        `;
        const res = await pgPool.query(query, [id]);
        return res.rows[0] || null;
    }


    async findSlotByProductAndCategory(productId: number, categoryId: number): Promise<CustomizationSlot | null> {
        const query = `
            SELECT 
                id, 
                product_id AS "productId", 
                category_id AS "categoryId", 
                min_select AS "minSelect", 
                max_select AS "maxSelect", 
                display_order AS "displayOrder"
            FROM customization_slot
            WHERE product_id = $1 AND category_id = $2
        `;
        const res = await pgPool.query(query, [productId, categoryId]);
        return res.rows[0] || null;
    }


    async createSlot(data: CreateCustomizationSlotDTO): Promise<CustomizationSlot> {
        const query = `
            INSERT INTO customization_slot (product_id, category_id, min_select, max_select, display_order)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, product_id AS "productId", category_id AS "categoryId", min_select AS "minSelect", max_select AS "maxSelect", display_order AS "displayOrder"
        `;
        const res = await pgPool.query(query, [
            data.product_id,
            data.category_id,
            data.min_select ?? 0,
            data.max_select ?? 1,
            data.display_order ?? 0
        ]);
        return res.rows[0];
    }


    async updateSlot(id: number, minSelect: number, maxSelect: number, displayOrder: number): Promise<CustomizationSlot | null> {
        const query = `
            UPDATE customization_slot
            SET min_select = $1, max_select = $2, display_order = $3
            WHERE id = $4
            RETURNING id, product_id AS "productId", category_id AS "categoryId", min_select AS "minSelect", max_select AS "maxSelect", display_order AS "displayOrder"
        `;
        const res = await pgPool.query(query, [minSelect, maxSelect, displayOrder, id]);
        return res.rows[0] || null;
    }



    async deleteSlot(id: number): Promise<boolean> {
        const res = await pgPool.query('DELETE FROM customization_slot WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
    }
}
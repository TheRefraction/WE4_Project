import { pgPool } from '../config/postgres';
import { CustomizationSlot, CustomizationSlotOption, CreateCustomizationSlotDTO, CreateCustomizationOptionDTO } from '../models/customizationslot.model';

export class CustomizationRepository {

    //methodes liées aux slots


    async findAllSlots(): Promise<any[]> {
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
        return res.rows || [];
    }



    
    async findSlotsByProductId(productId: number): Promise<any[]> {
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
        return res.rows || [];
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


    //methodes liées aux options de slots


    async createOption(slotId: number, data: CreateCustomizationOptionDTO): Promise<CustomizationSlotOption> {
        const query = `
            INSERT INTO customization_slot_option (customization_slot_id, product_id, price_delta, is_default, display_order)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING customization_slot_id AS "customizationSlotId", product_id AS "productId", price_delta AS "priceDelta", is_default AS "isDefault", display_order AS "displayOrder"
        `;
        const res = await pgPool.query(query, [
            slotId,
            data.product_id,
            data.price_delta ?? 0,
            data.is_default ?? false,
            data.display_order ?? 0
        ]);
        return res.rows[0];
    }


    async updateOption(slotId: number, productId: number, priceDelta: number, isDefault: boolean, displayOrder: number): Promise<CustomizationSlotOption | null> {
        const query = `
            UPDATE customization_slot_option
            SET price_delta = $1, is_default = $2, display_order = $3
            WHERE customization_slot_id = $4 AND product_id = $5
            RETURNING customization_slot_id AS "customizationSlotId", product_id AS "productId", price_delta AS "priceDelta", is_default AS "isDefault", display_order AS "displayOrder"
        `;
        const res = await pgPool.query(query, [priceDelta, isDefault, displayOrder, slotId, productId]);
        return res.rows[0] || null;
    }


    async deleteOption(slotId: number, productId: number): Promise<boolean> {
        const query = 'DELETE FROM customization_slot_option WHERE customization_slot_id = $1 AND product_id = $2';
        const res = await pgPool.query(query, [slotId, productId]);
        return (res.rowCount ?? 0) > 0;
    }


    async findOptionBySlotAndProduct(slotId: number, productId: number): Promise<any | null> {
        const query = `
            SELECT 
                cso.customization_slot_id AS "customizationSlotId",
                cso.product_id AS "productId",
                cso.price_delta AS "priceDelta",
                cso.is_default AS "isDefault",
                cso.display_order AS "displayOrder",
                p.name AS "optionProductName"
            FROM customization_slot_option cso
            LEFT JOIN product p ON cso.product_id = p.id
            WHERE cso.customization_slot_id = $1 AND cso.product_id = $2
        `;
        const res = await pgPool.query(query, [slotId, productId]);
        return res.rows[0] || null;
    }

    

    async findOptionsBySlotId(slotId: number): Promise<any[]> {
        const query = `
            SELECT 
                cso.customization_slot_id AS "customizationSlotId",
                cso.product_id AS "productId",
                p.name AS "optionProductName",
                p.price AS "basePrice",
                cso.price_delta AS "priceDelta",
                cso.is_default AS "isDefault",
                cso.display_order AS "displayOrder"
            FROM customization_slot_option cso
            LEFT JOIN product p ON cso.product_id = p.id
            WHERE cso.customization_slot_id = $1
            ORDER BY cso.display_order ASC
        `;
        const res = await pgPool.query(query, [slotId]);
        return res.rows || [];
    }
}
import { pgPool } from '../config/postgres';
import {  } from '../models/option.model';

export class CustomizationOption {
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
}
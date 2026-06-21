/**
 * option.repository.ts
 */

import { pgPool } from '../config/postgres';
import { CustomizationOptionResponse, CreateCustomizationOptionDTO, UpdateCustomizationOptionDTO } from '../models/option.model';

const OPTION_FIELDS = `
    cso.customization_slot_id AS "slotId",
    cso.product_id AS "productId",
    cso.price_delta AS "priceDelta",
    cso.is_default AS "isDefault",
    cso.display_order AS "displayOrder"
`;

const RETURN_FIELDS = `
    customization_slot_id AS "slotId", 
    product_id AS "productId", 
    price_delta AS "priceDelta", 
    is_default AS "isDefault", 
    display_order AS "displayOrder"
`;

export class CustomizationOptionRepository {
    async findAllBySlotId(slotId: number): Promise<CustomizationOptionResponse[]> {
        const query = `
            SELECT 
                ${OPTION_FIELDS},
                p.name AS "name"
            FROM customization_slot_option cso
            LEFT JOIN product p ON cso.product_id = p.id
            WHERE cso.customization_slot_id = $1
            ORDER BY cso.display_order ASC
        `;

        const res = await pgPool.query(query, [slotId]);
        return res.rows || [];
    }

    async findBySlotAndProduct(slotId: number, productId: number): Promise<CustomizationOptionResponse | null> {
        const query = `
            SELECT 
                ${OPTION_FIELDS},
                p.name AS "name"
            FROM customization_slot_option cso
            LEFT JOIN product p ON cso.product_id = p.id
            WHERE cso.customization_slot_id = $1 AND cso.product_id = $2
        `;

        const res = await pgPool.query(query, [slotId, productId]);

        if (!res.rows[0]) {
            return null;
        }

        return res.rows[0];
    }

    async create(slotId: number, data: CreateCustomizationOptionDTO): Promise<CustomizationOptionResponse> {
        const {
            productId,
            priceDelta,
            isDefault,
            displayOrder
        } = data;

        const query = `
            INSERT INTO customization_slot_option (customization_slot_id, product_id, price_delta, is_default, display_order)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING ${RETURN_FIELDS}
        `;

        const res = await pgPool.query(query, [slotId, productId, priceDelta, isDefault, displayOrder]);
        const option : CustomizationOptionResponse = res.rows[0];

        return option;
    }

    async update(slotId: number, data: UpdateCustomizationOptionDTO): Promise<CustomizationOptionResponse | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (data.productId === undefined) return null; // Cannot update nothing

        fields.push(`product_id = $${paramCount++}`);
        values.push(data.productId);

        if (data.priceDelta !== undefined) {
            fields.push(`price_delta = $${paramCount++}`);
            values.push(data.priceDelta);
        }

        if (data.isDefault !== undefined) {
            fields.push(`is_default = $${paramCount++}`);
            values.push(data.isDefault);
        }

        if (data.displayOrder !== undefined) {
            fields.push(`display_order = $${paramCount++}`);
            values.push(data.displayOrder);
        }

        if (fields.length === 1) return this.findBySlotAndProduct(slotId, data.productId);
        values.push(slotId);

        const query = `
            UPDATE customization_slot_option SET ${fields.join(', ')} 
            WHERE customization_slot_id = $${paramCount} AND product_id = $1
            RETURNING ${RETURN_FIELDS}
        `;

        const res = await pgPool.query(query, values);

        if (!res.rows[0]) {
            return null;
        }

        const option : CustomizationOptionResponse = res.rows[0];

        return option;
    }

    async delete(slotId: number, productId: number): Promise<boolean> {
        const query = 'DELETE FROM customization_slot_option WHERE customization_slot_id = $1 AND product_id = $2';
        const res = await pgPool.query(query, [slotId, productId]);

        return (res.rowCount ?? 0) > 0;
    }
}
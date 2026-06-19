/**
 * customization.repository.ts
 */

import { pgPool } from '../config/postgres';
import { CustomizationSlotResponse, CreateCustomizationSlotDTO, UpdateCustomizationSlotDTO } from '../models/customization.model';

const SELECT_FIELDS = `
    id,
    product_id AS "productId",
    category_id AS "categoryId",
    min_select AS "minSelect",
    max_select AS "maxSelect",
    display_order AS "displayOrder"
`;

const RETURN_FIELDS = `
    id, 
    product_id AS "productId", 
    category_id AS "categoryId", 
    min_select AS "minSelect", 
    max_select AS "maxSelect", 
    display_order AS "displayOrder"
`;

export class CustomizationSlotRepository {
    async findAll(): Promise<CustomizationSlotResponse[]> {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM customization_slot
            ORDER BY display_order
        `;

        const res = await pgPool.query(query);
        const slots : CustomizationSlotResponse[] = res.rows;

        return slots || [];
    }

    async findAllByProductId(productId: number): Promise<CustomizationSlotResponse[]> {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM customization_slot
            WHERE product_id = $1
            ORDER BY display_order
        `;

        const res = await pgPool.query(query, [productId]);
        const slots : CustomizationSlotResponse[] = res.rows;

        return slots || [];
    }

    async findById(id: number): Promise<CustomizationSlotResponse | null> {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM customization_slot 
            WHERE id = $1
        `;

        const res = await pgPool.query(query, [id]);

        if (!res.rows[0]) {
            return null;
        }

        const slot : CustomizationSlotResponse = res.rows[0];
        return slot;
    }

    async findByProductAndCategory(productId: number, categoryId: number): Promise<CustomizationSlotResponse | null> {
        const query = `
            SELECT ${SELECT_FIELDS}
            FROM customization_slot
            WHERE product_id = $1 AND category_id = $2
        `;

        const res = await pgPool.query(query, [productId, categoryId]);

        if (!res.rows[0]) {
            return null;
        }

        const slot : CustomizationSlotResponse = res.rows[0];
        return slot;
    }

    async create(data: CreateCustomizationSlotDTO): Promise<CustomizationSlotResponse> {
        const {
            productId,
            categoryId,
            minSelect,
            maxSelect,
            displayOrder
        } = data;

        const query = `
            INSERT INTO customization_slot (product_id, category_id, min_select, max_select, display_order)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING ${RETURN_FIELDS}
        `;

        const res = await pgPool.query(query, [productId, categoryId, minSelect, maxSelect, displayOrder]);
        const slot : CustomizationSlotResponse = res.rows[0];

        return slot;
    }

    async update(id: number, data: UpdateCustomizationSlotDTO): Promise<CustomizationSlotResponse | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (data.productId !== undefined) {
            fields.push(`product_id = $${paramCount++}`);
            values.push(data.productId);
        }

        if (data.categoryId !== undefined) {
            fields.push(`category_id = $${paramCount++}`);
            values.push(data.categoryId);
        }

        if (data.minSelect !== undefined) {
            fields.push(`min_select = $${paramCount++}`);
            values.push(data.minSelect);
        }

        if (data.maxSelect !== undefined) {
            fields.push(`max_select = $${paramCount++}`);
            values.push(data.maxSelect);
        }

        if (data.displayOrder !== undefined) {
            fields.push(`display_order = $${paramCount++}`);
            values.push(data.displayOrder);
        }

        if (fields.length === 0) return this.findById(id);
        values.push(id);

        const query = `
            UPDATE customization_slot SET ${fields.join(', ')} 
            WHERE id = $${paramCount}
            RETURNING ${RETURN_FIELDS}
        `;

        const res = await pgPool.query(query, values);

        if (!res.rows[0]) {
            return null;
        }

        const slot : CustomizationSlotResponse = res.rows[0];

        return slot;
    }

    async delete(id: number): Promise<boolean> {
        const res = await pgPool.query('DELETE FROM customization_slot WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
    }
}
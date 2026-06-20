"use strict";
/**
 * menu.repository.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuRepository = void 0;
const postgres_1 = require("../config/postgres");
class MenuRepository {
    async findAll(showHidden = true) {
        let query = `
            SELECT id, name, description, price, hidden, picture_url AS "pictureUrl"
            FROM menu
        `;
        if (!showHidden) {
            query += ' WHERE hidden = FALSE';
        }
        query += ' ORDER BY id ASC';
        const res = await postgres_1.pgPool.query(query);
        return res.rows || [];
    }
    async findById(id) {
        const query = `
            SELECT id, name, description, price, hidden, picture_url AS "pictureUrl"
            FROM menu
            WHERE id = $1
        `;
        const res = await postgres_1.pgPool.query(query, [id]);
        return res.rows[0] || null;
    }
    async findProductsByMenuId(menuId) {
        const query = `
            SELECT p.id, p.name, p.description, p.price, p.supplier_id AS "supplierId", p.hidden
            FROM menu_slot ms
            JOIN menu_slot_product msp ON ms.id = msp.menu_slot_id
            JOIN product p ON msp.product_id = p.id
            WHERE ms.menu_id = $1
            ORDER BY msp.display_order ASC
        `;
        const res = await postgres_1.pgPool.query(query, [menuId]);
        return res.rows || [];
    }
    async create(data) {
        const client = await postgres_1.pgPool.connect();
        try {
            await client.query('BEGIN');
            const insertMenuQuery = `
                INSERT INTO menu (name, description, price, hidden, picture_url)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, name, description, price, hidden, picture_url AS "pictureUrl"
            `;
            const menuRes = await client.query(insertMenuQuery, [
                data.name,
                data.description || null,
                data.price,
                data.hidden ?? false,
                data.pictureUrl || null
            ]);
            const menu = menuRes.rows[0];
            if (data.productIds && data.productIds.length > 0) {
                const insertSlotQuery = `
                    INSERT INTO menu_slot (menu_id, name, min_select, max_select, display_order)
                    VALUES ($1, 'Sélection', 1, 1, 0)
                    RETURNING id
                `;
                const slotRes = await client.query(insertSlotQuery, [menu.id]);
                const slotId = slotRes.rows[0].id;
                for (let i = 0; i < data.productIds.length; i++) {
                    const insertProductQuery = `
                        INSERT INTO menu_slot_product (menu_slot_id, product_id, price_delta, is_default, display_order)
                        VALUES ($1, $2, 0, $3, $4)
                    `;
                    await client.query(insertProductQuery, [
                        slotId,
                        data.productIds[i],
                        i === 0,
                        i
                    ]);
                }
            }
            await client.query('COMMIT');
            return menu;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async update(id, data) {
        const client = await postgres_1.pgPool.connect();
        try {
            await client.query('BEGIN');
            const fields = [];
            const values = [];
            let paramCount = 1;
            if (data.name !== undefined) {
                fields.push(`name = $${paramCount++}`);
                values.push(data.name);
            }
            if (data.description !== undefined) {
                fields.push(`description = $${paramCount++}`);
                values.push(data.description);
            }
            if (data.price !== undefined) {
                fields.push(`price = $${paramCount++}`);
                values.push(data.price);
            }
            if (data.hidden !== undefined) {
                fields.push(`hidden = $${paramCount++}`);
                values.push(data.hidden);
            }
            if (data.pictureUrl !== undefined) {
                fields.push(`picture_url = $${paramCount++}`);
                values.push(data.pictureUrl);
            }
            let menu = null;
            if (fields.length > 0) {
                values.push(id);
                const query = `
                    UPDATE menu SET ${fields.join(', ')}
                    WHERE id = $${paramCount}
                    RETURNING id, name, description, price, hidden, picture_url AS "pictureUrl"
                `;
                const res = await client.query(query, values);
                menu = res.rows[0] || null;
            }
            else {
                const query = `
                    SELECT id, name, description, price, hidden, picture_url AS "pictureUrl"
                    FROM menu WHERE id = $1
                `;
                const res = await client.query(query, [id]);
                menu = res.rows[0] || null;
            }
            if (data.productIds !== undefined) {
                await client.query('DELETE FROM menu_slot WHERE menu_id = $1', [id]);
                if (data.productIds.length > 0) {
                    const insertSlotQuery = `
                        INSERT INTO menu_slot (menu_id, name, min_select, max_select, display_order)
                        VALUES ($1, 'Sélection', 1, 1, 0)
                        RETURNING id
                    `;
                    const slotRes = await client.query(insertSlotQuery, [id]);
                    const slotId = slotRes.rows[0].id;
                    for (let i = 0; i < data.productIds.length; i++) {
                        const insertProductQuery = `
                            INSERT INTO menu_slot_product (menu_slot_id, product_id, price_delta, is_default, display_order)
                            VALUES ($1, $2, 0, $3, $4)
                        `;
                        await client.query(insertProductQuery, [
                            slotId,
                            data.productIds[i],
                            i === 0,
                            i
                        ]);
                    }
                }
            }
            await client.query('COMMIT');
            return menu;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async delete(id) {
        const query = 'DELETE FROM menu WHERE id = $1';
        const res = await postgres_1.pgPool.query(query, [id]);
        return (res.rowCount ?? 0) > 0;
    }
}
exports.MenuRepository = MenuRepository;

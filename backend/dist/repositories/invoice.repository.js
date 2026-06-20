"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRepository = void 0;
const postgres_1 = require("../config/postgres");
const mongo_1 = require("../config/mongo");
const mongodb_1 = require("mongodb");
class InvoiceRepository {
    async createInvoiceWithItems(invoiceData) {
        const { customerId, amount, billingAddress, items } = invoiceData;
        const pgQuery = `
        INSERT INTO invoice (account_id, amount, billing_address, status, payment_id)
        VALUES ($1, $2, $3, 'draft', NULL)
        RETURNING *;`;
        const pgResult = await postgres_1.pgPool.query(pgQuery, [
            customerId,
            amount,
            JSON.stringify(billingAddress)
        ]);
        const createdInvoice = pgResult.rows[0];
        //mongo insertion
        const collection = (0, mongo_1.getCollection)('invoices');
        const reorganisedItems = items.map((item) => {
            const cleanItem = {
                type: item.type,
                name: item.name,
                price: new mongodb_1.Double(parseFloat(item.price)),
                quantity: new mongodb_1.Int32(parseInt(item.quantity, 10))
            };
            // for product
            if (item.options && Array.isArray(item.options)) {
                cleanItem.options = item.options.map((opt) => ({
                    name: opt.name,
                    item: {
                        name: opt.item.name,
                        delta: new mongodb_1.Double(parseFloat(opt.item.delta)),
                        quantity: new mongodb_1.Int32(parseInt(opt.item.quantity, 10))
                    }
                }));
            }
            //for menu
            if (item.slots && Array.isArray(item.slots)) {
                cleanItem.slots = item.slots.map((slot) => {
                    const cleanSlot = {
                        name: slot.name,
                        item: {
                            name: slot.item.name,
                            delta: new mongodb_1.Double(parseFloat(slot.item.delta)),
                            quantity: new mongodb_1.Int32(parseInt(slot.item.quantity, 10))
                        }
                    };
                    // options in menu
                    if (slot.item.options && Array.isArray(slot.item.options)) {
                        cleanSlot.item.options = slot.item.options.map((opt) => ({
                            name: opt.name,
                            item: {
                                name: opt.item.name,
                                delta: new mongodb_1.Double(parseFloat(opt.item.delta)),
                                quantity: new mongodb_1.Int32(parseInt(opt.item.quantity, 10))
                            }
                        }));
                    }
                    return cleanSlot;
                });
            }
            return cleanItem;
        });
        await collection.insertOne({
            _id: new mongodb_1.Int32(createdInvoice.id),
            items: reorganisedItems
        });
        return createdInvoice;
    }
    async findInvoiceWithDetails(invoiceId) {
        const pgQuery = `SELECT * FROM invoice WHERE id = $1;`;
        const pgResult = await postgres_1.pgPool.query(pgQuery, [invoiceId]);
        const invoice = pgResult.rows[0];
        if (!invoice)
            return null;
        const collection = (0, mongo_1.getCollection)('invoices');
        const mongoResult = await collection.findOne({ _id: new mongodb_1.Int32(invoiceId) });
        return {
            id: invoice.id,
            customerId: invoice.account_id,
            amount: invoice.amount,
            billingAddress: invoice.billing_address,
            status: invoice.status,
            paymentId: invoice.payment_id,
            createdAt: invoice.created_at,
            items: mongoResult ? mongoResult.items : []
        };
    }
    async findAllInvoices() {
        const query = `
            SELECT id, account_id AS "customerId", amount, billing_address AS "billingAddress", status, payment_id AS "paymentId", created_at AS "createdAt"
            FROM invoice
            ORDER BY created_at DESC;
        `;
        const res = await postgres_1.pgPool.query(query);
        return res.rows;
    }
    async updateInvoiceStatus(invoiceId, status) {
        const query = `
            UPDATE invoice
            SET status = $1, updated_at = NOW()
            WHERE id = $2;
        `;
        const res = await postgres_1.pgPool.query(query, [status, invoiceId]);
        return (res.rowCount ?? 0) > 0;
    }
}
exports.InvoiceRepository = InvoiceRepository;

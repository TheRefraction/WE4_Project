import { pgPool } from '../config/postgres';
import { getCollection } from '../config/mongo';
import { Int32, Double } from 'mongodb'; 

import { InvoiceResponse, InvoiceItem, OptionItem, CreateInvoiceDTO, UpdateInvoiceDTO } from '../models/invoice.model';

const RETURN_FIELDS = `
    id,
    account_id AS "accountId", 
    amount,
    billing_address AS "billingAddress",
    status,
    payment_id AS "paymentId",
    created_at AS "createdAt",
    updated_at AS "updatedAt"
`;

export class InvoiceRepository {
    async create(data: CreateInvoiceDTO): Promise<InvoiceResponse> {
        const {
            accountId,
            amount,
            billingAddress,
            items,
            status
        } = data;

        const pgQuery = `
            INSERT INTO invoice (account_id, amount, billing_address, status, payment_id)
            VALUES ($1, $2, $3, $4, NULL)
            RETURNING ${RETURN_FIELDS};
        `;

        const pgResult = await pgPool.query(pgQuery, [
            accountId,
            amount,
            JSON.stringify(billingAddress),
            status
        ]);

        const invoiceRaw : InvoiceResponse = pgResult.rows[0];

        const reorganisedItems = items.map((item: InvoiceItem) => {
            const cleanItem: any = {
                type: item.type,
                name: item.name,
                price: new Double(item.price), 
                quantity: new Int32(item.quantity) 
            };
            
            // Only products for now
            if (item.options && Array.isArray(item.options)) {
                cleanItem.options = item.options.map((opt: OptionItem) => ({
                    name: opt.name ?? 'Unknown',
                    item: {
                        name: opt.item.name ?? 'Unknown option',
                        delta: new Double(opt.item.delta ?? 0),
                        quantity: new Int32(opt.item.quantity ?? 0)
                    }
                }));
            }
            
            return cleanItem;
        });

        const invoiceCollection = getCollection<any>('invoices');

        await invoiceCollection.insertOne({
            _id: new Int32(invoiceRaw.id), 
            items: reorganisedItems
        });

        return invoiceRaw;
    }

    async findAll(): Promise<InvoiceResponse[]> {
        const pgQuery = `SELECT ${RETURN_FIELDS} FROM invoice`;
        const pgResult = await pgPool.query(pgQuery);
        
        const invoices: InvoiceResponse[] = pgResult.rows;
        if (invoices.length === 0) return [];

        const ids = invoices.map(inv => new Int32(inv.id));

        const invoiceCollection = getCollection<any>('invoices');
        const mongoItems = await invoiceCollection
            .find({ _id: { $in: ids } })
            .toArray();

        return invoices.map(inv => {
            const itemsData = mongoItems.find(m => m._id === inv.id);
            return {
                ...inv,
                items: itemsData?.items || []
            };
        });
    }

    async findById(id: number): Promise<InvoiceResponse | null> {
        // Postgres
        const pgQuery = `SELECT ${RETURN_FIELDS} FROM invoice WHERE id = $1`;
        const pgResult = await pgPool.query(pgQuery, [id]);
        
        if (pgResult.rowCount === 0) return null;
        const invoice : InvoiceResponse = pgResult.rows[0];

        // Mongo
        const invoiceCollection = getCollection<any>('invoices');
        const mongoData = await invoiceCollection.findOne({ _id: new Int32(id) });

        return {
            ...invoice,
            items: mongoData?.items || []
        };
    }

    async update(id: number, data: UpdateInvoiceDTO): Promise<InvoiceResponse | null> {
        const { items, ...pgData } = data;

        const pgQuery = `
            UPDATE invoice 
            SET amount = COALESCE($1, amount),
                billing_address = COALESCE($2, billing_address),
                status = COALESCE($3, status)
            WHERE id = $4
            RETURNING ${RETURN_FIELDS};
        `;
        
        const pgResult = await pgPool.query(pgQuery, [
            pgData.amount,
            pgData.billingAddress ? JSON.stringify(pgData.billingAddress) : null,
            pgData.status,
            id
        ]);

        if (pgResult.rowCount === 0) return null;

        if (items) {
            const reorganisedItems = items.map((item) => ({
                type: item.type,
                name: item.name,
                price: new Double(item.price),
                quantity: new Int32(item.quantity),
                options: item.options?.map(opt => ({
                    name: opt.name,
                    item: {
                        name: opt.item.name,
                        delta: new Double(opt.item.delta),
                        quantity: new Int32(opt.item.quantity)
                    }
                }))
            }));

            const invoiceCollection = getCollection<any>('invoices');
            await invoiceCollection.updateOne(
                { _id: new Int32(id) },
                { $set: { items: reorganisedItems } },
                { upsert: true }
            );
        }

        return pgResult.rows[0];
    }

    async delete(id: number): Promise<boolean> {
        const invoiceCollection = getCollection<any>('invoices');
        await invoiceCollection.deleteOne({ _id: new Int32(id) });

        const pgResult = await pgPool.query('DELETE FROM invoice WHERE id = $1', [id]);
        
        return (pgResult.rowCount ?? 0) > 0;
    }
}
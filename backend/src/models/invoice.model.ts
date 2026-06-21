/**
 * invoice.model.ts
 */

import { PaymentResponse } from '../models/payment.model';

export const InvoiceStatus = {
    Unknown: 'unknown',
    Draft: 'draft',
    Pending: 'pending',
    Paid: 'paid',
    Cancelled: 'cancelled'
} as const;

export type InvoiceStatus = typeof InvoiceStatus[keyof typeof InvoiceStatus];

export interface BillingAddress {
    street: string;
    city: string;
    zip: string;
    country: string;
}

export interface OptionItem {
    name: string;
    item: {
        name: string;
        delta: number;
        quantity: number;
    }
}

export interface InvoiceItem {
    type: 'product', // Fixed to product as menus are not implemented
    name: string,
    price: number,
    quantity: number,
    options?: OptionItem[]
};

export interface Invoice {
    readonly id: number;
    readonly accountId: number;
    amount: number;
    billingAddress: BillingAddress;
    items: InvoiceItem[];
    status: InvoiceStatus;
    paymentId?: number; 
    createdAt: Date;
    updatedAt: Date;
}

export type CreateInvoiceDTO = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'paymentId'>;

export type UpdateInvoiceDTO = Partial<Omit<Invoice, 'id' | 'accountId' | 'createdAt' | 'updatedAt'>>;

export interface InvoiceResponse extends Invoice {
    payment?: PaymentResponse
}
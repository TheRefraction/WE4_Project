export enum InvoiceStatus {
    UNKNOWN = 'unknown',
    DRAFT = 'draft',
    PENDING = 'paid',
    PAID = 'paid',
    CANCELLED = 'cancelled'
}


export interface BillingAddress {
    street: string;
    city: string;
    zip: string;
    country: string;
}


export interface Invoice {
    id : number;
    account_id : number;
    amount : number;
    billing_address: BillingAddress;
    status : InvoiceStatus;
    payment_id? : number | null; 
    created_at?: Date;
    updated_at?: Date;
}
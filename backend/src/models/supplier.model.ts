/**
 * supplier.model.ts 
 */

export interface ContactInfo {
    email: string;
    phone: string;
}

export interface Supplier {
    readonly id: number;
    name: string;
    contactInfo: ContactInfo; 
}

export type CreateSupplierDTO = Omit<Supplier, 'id'>;

export type UpdateSupplierDTO = Partial<Omit<Supplier, 'id'>>;

export interface SupplierResponse extends Supplier {
    productCount?: number;
}
export interface ContactInfo {
    email: string;
    phone: string;
}

export interface Supplier {
    id: number;
    name: string;
    contactInfo: ContactInfo; 
}

export interface CreateSupplierDTO {
    name: string;
    contactInfo: ContactInfo;
}

export interface UpdateSupplierDTO {
    name?: string;
    contactInfo?: Partial<ContactInfo>;
}

export interface SupplierResponse {
    id: number;
    name: string;
    contactInfo: ContactInfo;
    productCount?: number;
}
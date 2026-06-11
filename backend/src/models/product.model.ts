export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    supplier_id: number | null;
    hidden: boolean;
}

export interface CreateProductDTO {
    name: string;
    description?: string | null;
    price: number;
    supplier_id: number | null;
    hidden?: boolean;
    categoryIds: number[];
}

export interface UpdateProductDTO {
    name?: string;
    description?: string | null;
    price?: number;
    supplier_id?: number | null;
    hidden?: boolean;
    categoryIds?: number[]; 
}

export interface ProductResponse {
    id: number;
    name: string;
    description: string | null;
    price: number;
    supplierId: number | null; 
    hidden: boolean;
    supplierName?: string | null;
    categories?: string | null; 
    supplierEmail?: string | null;
    supplierPhone?: string | null;
}
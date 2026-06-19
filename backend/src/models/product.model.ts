/**
 * product.model.ts 
 */

import { CategoryResponse } from "./category.model";
import { CustomizationSlotResponse } from "./customization.model";
import { SupplierResponse } from "./supplier.model";

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    supplierId?: number;
    hidden: boolean;
}

export type CreateProductDTO = Omit<Product, 'id'>;

export type UpdateProductDTO = Partial<Omit<Product, 'id'>>;

export interface ProductResponse extends Product {
    customizations?: CustomizationSlotResponse[];
    categories?: CategoryResponse[];
    supplier?: SupplierResponse;
}
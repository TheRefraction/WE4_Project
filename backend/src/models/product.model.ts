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

export type CreateProductDTO = Omit<Product, 'id'> & { categoryIds?: number[] };

export type UpdateProductDTO = Partial<Omit<Product, 'id'>> & { categoryIds?: number[] };

export interface ProductResponse extends Product {
    customizations?: CustomizationSlotResponse[];
    categories?: CategoryResponse[];
    supplier?: SupplierResponse;
}
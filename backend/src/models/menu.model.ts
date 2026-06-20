/**
 * menu.model.ts
 */

import { ProductResponse } from "./product.model";

export interface Menu {
    id: number;
    name: string;
    description?: string;
    price: number;
    hidden: boolean;
    pictureUrl?: string;
}

export type CreateMenuDTO = Omit<Menu, 'id'> & { productIds?: number[] };
export type UpdateMenuDTO = Partial<Omit<Menu, 'id'>> & { productIds?: number[] };

export interface MenuSlotResponse {
    id: number;
    name: string;
    minSelect: number;
    maxSelect: number;
    displayOrder: number;
    products: (ProductResponse & { priceDelta: number; isDefault: boolean })[];
}

export interface MenuResponse extends Menu {
    products?: ProductResponse[];
    slots?: MenuSlotResponse[];
}


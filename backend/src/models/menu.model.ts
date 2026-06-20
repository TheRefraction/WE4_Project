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

export interface MenuResponse extends Menu {
    products?: ProductResponse[];
}

/**
 * customization.model.ts
 */

import { CustomizationOptionResponse } from "./option.model";

/**
 * Slots open for customization on a given product
 * A product can have 0 or n slots.
 */
export interface CustomizationSlot {
    readonly id: number;
    productId: number;
    categoryId: number;
    minSelect: number;
    maxSelect: number;
    displayOrder: number;
}

export type CreateCustomizationSlotDTO = Omit<CustomizationSlot, 'id'>;

export type UpdateCustomizationSlotDTO = Partial<Omit<CustomizationSlot, 'id'>>;

export interface CustomizationSlotResponse extends CustomizationSlot {
    options?: CustomizationOptionResponse[]; 
}
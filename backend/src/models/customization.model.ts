/**
 * customization.model.ts
 */

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
    categoryName: string;
    options: CustomizationOptionResponse[]; 
}

/**
 * Part of what products can be chosen for defined slots
 */
export interface CustomizationOption {
    readonly slotId: number;
    productId: number;
    priceDelta: number;
    isDefault: boolean;
    displayOrder: number;
}

export type CreateCustomizationOptionDTO = CustomizationOption;

export type UpdateCustomizationOptionDTO = Partial<Omit<CustomizationOption, 'slotId'>>;

export interface CustomizationOptionResponse extends Omit<CustomizationOption, 'slotId'> {
    name: string;
    price: number;
}
/**
 * option.model.ts
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
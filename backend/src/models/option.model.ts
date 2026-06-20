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

export type UpdateCustomizationOptionDTO = Pick<CustomizationOption, 'productId'> & 
    Partial<Omit<CustomizationOption, 'slotId' | 'productId'>>;

export interface CustomizationOptionResponse extends CustomizationOption {
    name?: string;
}


/**
 * structure de la table customization_slot
 */
export interface CustomizationSlot {
    id: number;
    productId: number;
    categoryId: number;
    minSelect: number;
    maxSelect: number;
    displayOrder: number;
}

/**
 * structure de la table customization_slot_option
 */
export interface CustomizationSlotOption {
    customizationSlotId: number;
    productId: number;
    priceDelta: number;
    isDefault: boolean;
    displayOrder: number;
}


export interface CreateCustomizationSlotDTO {
    product_id: number; 
    category_id: number;
    min_select?: number;
    max_select?: number;
    display_order?: number;
}


export interface CreateCustomizationOptionDTO {
    product_id: number;
    price_delta?: number;
    is_default?: boolean;
    display_order?: number;
}


export interface CustomizationOptionResponse {
    productId: number;
    optionName: string;  
    basePrice: number;
    priceDelta: number;
    isDefault: boolean;
    displayOrder: number;
}


export interface CustomizationSlotResponse {
    id: number;
    productId: number;
    categoryId: number;
    categoryName: string;    
    minSelect: number;
    maxSelect: number;
    displayOrder: number;
    options: CustomizationOptionResponse[]; 
}
/**
 * category.model.ts
 */

export interface Category {
    id: number;
    name: string;
}

export interface CreateCategoryDTO {
    name: string;
}

export interface UpdateCategoryDTO {
    name: string;
}

export interface CategoryResponse {
    id: number;
    name: string;
    productCount?: number;
}
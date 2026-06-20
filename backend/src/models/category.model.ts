/**
 * category.model.ts 
 */

export interface Category {
    readonly id: number;
    name: string;
}

export type CreateCategoryDTO = Omit<Category, 'id'>;

export type UpdateCategoryDTO = Partial<Omit<Category, 'id'>>;

export interface CategoryResponse extends Category {
    productCount?: number;
}
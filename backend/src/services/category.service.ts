import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryResponse } from '../models/category.model';

export class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor() {
        this.categoryRepository = new CategoryRepository();
    }


    async getAllCategories(): Promise<CategoryResponse[]> {
        return await this.categoryRepository.findAll();
    }


    async getCategoryById(id: number): Promise<CategoryResponse> {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }


    async createCategory(dto: CreateCategoryDTO): Promise<CategoryResponse> {
        const existingCategory = await this.categoryRepository.findByName(dto.name);
        if (existingCategory) {
            throw new Error('Category with this name already exists');
        } 

        return await this.categoryRepository.create(dto);
    }

    async updateCategory(id: number, dto: UpdateCategoryDTO): Promise<CategoryResponse | null> {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new Error('Category not found');
        }

        const categoryWithSameName = await this.categoryRepository.findByName(dto.name);
        if (categoryWithSameName && categoryWithSameName.id !== id) { 
            throw new Error('Category with this name already exists');
        }

        return await this.categoryRepository.update(id, dto);
    }


    async deleteCategory(id: number): Promise<{ success: boolean }> {
        const existingCategory = await this.categoryRepository.findById(id); 
        if (!existingCategory) {
            throw new Error('Category not found');
        }

        const dependencyCount = await this.categoryRepository.countDependencies(id);
        if (dependencyCount > 0) {
            throw new Error('Cannot delete category because linked to products');
        } 

        const success = await this.categoryRepository.delete(id);
        if (!success) {
            throw new Error('Failed to delete category');
        }

        return { success: true };
    }
}
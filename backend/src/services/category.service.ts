/**
 * category.service.ts
 */

import { CategoryRepository } from '../repositories/category.repository';
import { CategoryResponse, CreateCategoryDTO, UpdateCategoryDTO } from '../models/category.model';
import { AppError } from '../middlewares/error.middleware';
import { HttpStatus } from '../utils/httpStatus';

export class CategoryService {
    constructor(private repo: CategoryRepository) {}

    async getAll(): Promise<CategoryResponse[]> {
        const categories = await this.repo.findAll();

        return Promise.all(categories.map((cat) => this.mapToResponse(cat)));
    }

    async getAllByProductId(productId: number): Promise<CategoryResponse[]> {
        const categories = await this.repo.findAllByProductId(productId);

        return Promise.all(categories.map((cat) => this.mapToResponse(cat)));
    }

    async getById(id: number): Promise<CategoryResponse> {
        const category = await this.repo.findById(id);

        if (!category) {
            throw new AppError('Category not found', HttpStatus.NOT_FOUND);
        }

        return this.mapToResponse(category);
    }

    async create(dto: CreateCategoryDTO): Promise<CategoryResponse> {
        const existingCategory = await this.repo.findByName(dto.name);
        if (existingCategory) {
            throw new AppError('Category with this name already exists', HttpStatus.CONFLICT);
        } 

        const cat = await this.repo.create(dto);

        return this.mapToResponse(cat);
    }

    async update(id: number, dto: UpdateCategoryDTO): Promise<CategoryResponse | null> {
        const existingCategory = await this.repo.findById(id);
        if (!existingCategory) {
            throw new AppError('Category not found', HttpStatus.NOT_FOUND);
        }

        if (dto.name) {
            const categoryWithSameName = await this.repo.findByName(dto.name);
            if (categoryWithSameName && categoryWithSameName.id !== id) { 
                throw new AppError('Category with this name already exists', HttpStatus.CONFLICT);
            }
        }

        const cat = await this.repo.update(id, dto);
        if (!cat) throw new AppError('Failed to update', HttpStatus.INTERNAL_SERVER_ERROR);

        return this.mapToResponse(cat);
    }


    async delete(id: number): Promise<{ success: boolean }> {
        const existingCategory = await this.repo.findById(id); 
        if (!existingCategory) {
            throw new AppError('Category not found', HttpStatus.NOT_FOUND);
        }

        const dependencyCount = await this.repo.countDependencies(id);
        if (dependencyCount > 0) {
            throw new AppError('Cannot delete category because linked to products', HttpStatus.CONFLICT);
        } 

        const success = await this.repo.delete(id);
        if (!success) {
            throw new AppError('Failed to delete category', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return { success: true };
    }

    private async mapToResponse(data: any): Promise<CategoryResponse> {
        return {
            id: data.id,
            name: data.name,
            productCount: data.productCount ?? 0
        };
    }
}
"use strict";
/**
 * category.service.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
class CategoryService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getAll() {
        const categories = await this.repo.findAll();
        return Promise.all(categories.map((cat) => this.mapToResponse(cat)));
    }
    async getAllByProductId(productId) {
        const categories = await this.repo.findAllByProductId(productId);
        return Promise.all(categories.map((cat) => this.mapToResponse(cat)));
    }
    async getById(id) {
        const category = await this.repo.findById(id);
        if (!category) {
            throw new error_middleware_1.AppError('Category not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        return this.mapToResponse(category);
    }
    async create(dto) {
        const existingCategory = await this.repo.findByName(dto.name);
        if (existingCategory) {
            throw new error_middleware_1.AppError('Category with this name already exists', 409 /* HttpStatus.CONFLICT */);
        }
        const cat = await this.repo.create(dto);
        return this.mapToResponse(cat);
    }
    async update(id, dto) {
        const existingCategory = await this.repo.findById(id);
        if (!existingCategory) {
            throw new error_middleware_1.AppError('Category not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        if (dto.name) {
            const categoryWithSameName = await this.repo.findByName(dto.name);
            if (categoryWithSameName && categoryWithSameName.id !== id) {
                throw new error_middleware_1.AppError('Category with this name already exists', 409 /* HttpStatus.CONFLICT */);
            }
        }
        const cat = await this.repo.update(id, dto);
        if (!cat)
            throw new error_middleware_1.AppError('Failed to update', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        return this.mapToResponse(cat);
    }
    async delete(id) {
        const existingCategory = await this.repo.findById(id);
        if (!existingCategory) {
            throw new error_middleware_1.AppError('Category not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const dependencyCount = await this.repo.countDependencies(id);
        if (dependencyCount > 0) {
            throw new error_middleware_1.AppError('Cannot delete category because linked to products', 409 /* HttpStatus.CONFLICT */);
        }
        const success = await this.repo.delete(id);
        if (!success) {
            throw new error_middleware_1.AppError('Failed to delete category', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        }
        return { success: true };
    }
    async mapToResponse(data) {
        return {
            id: data.id,
            name: data.name,
            productCount: data.productCount ?? 0
        };
    }
}
exports.CategoryService = CategoryService;

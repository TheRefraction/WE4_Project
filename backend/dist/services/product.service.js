"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
class ProductService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getAll(showHidden = true) {
        const products = await this.repo.findAll(showHidden);
        return Promise.all(products.map((prod) => this.mapToResponse(prod)));
    }
    async getById(id) {
        const product = await this.repo.findById(id);
        if (!product) {
            throw new error_middleware_1.AppError('Product not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        return this.mapToResponse(product);
    }
    async create(dto) {
        if (dto.price < 0)
            throw new error_middleware_1.AppError('Invalid price', 400 /* HttpStatus.BAD_REQUEST */);
        const prod = await this.repo.create(dto);
        return this.mapToResponse(prod);
    }
    async update(id, dto) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new error_middleware_1.AppError('Product not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        if (dto.price && dto.price < 0)
            throw new error_middleware_1.AppError('Invalid price', 400 /* HttpStatus.BAD_REQUEST */);
        const prod = await this.repo.update(id, dto);
        if (!prod)
            throw new error_middleware_1.AppError('Failed to update product', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        return this.mapToResponse(prod);
    }
    async delete(id) {
        const existingProduct = await this.repo.findById(id);
        if (!existingProduct) {
            throw new error_middleware_1.AppError('Product not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const success = await this.repo.delete(id);
        return { success: success };
    }
    async mapToResponse(data) {
        return {
            id: data.id,
            name: data.name,
            description: data.description ?? null,
            price: data.price,
            supplierId: data.supplierId ?? null,
            hidden: data.hidden,
            customizations: data.customizations ?? [],
            categories: data.categories ?? [],
            supplier: data.supplier ?? null
        };
    }
}
exports.ProductService = ProductService;

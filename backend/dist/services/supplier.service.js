"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierService = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
class SupplierService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getAll() {
        const suppliers = await this.repo.findAll();
        return Promise.all(suppliers.map((supplier) => this.mapToResponse(supplier)));
    }
    async getById(id) {
        const supplier = await this.repo.findById(id);
        if (!supplier)
            throw new error_middleware_1.AppError('Supplier not found', 404 /* HttpStatus.NOT_FOUND */);
        return this.mapToResponse(supplier);
    }
    async create(data) {
        const existingSupplier = await this.repo.findByName(data.name);
        if (existingSupplier) {
            throw new error_middleware_1.AppError('Supplier with this name already exists', 409 /* HttpStatus.CONFLICT */);
        }
        const supplier = await this.repo.create(data);
        return this.mapToResponse(supplier);
    }
    async update(id, data) {
        const existingSupplier = await this.repo.findById(id);
        if (!existingSupplier) {
            throw new error_middleware_1.AppError('Supplier not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        // Make sure to not lose data if only one attribute of contact is modified
        if (data.contactInfo) {
            data.contactInfo = {
                email: data.contactInfo.email ?? existingSupplier.contactInfo.email,
                phone: data.contactInfo.phone ?? existingSupplier.contactInfo.phone
            };
        }
        const updatedSupplier = await this.repo.update(id, data);
        if (!updatedSupplier) {
            throw new error_middleware_1.AppError('Failed to update supplier', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        }
        return this.mapToResponse(updatedSupplier);
    }
    async delete(id) {
        const supplier = await this.repo.findById(id);
        if (!supplier) {
            throw new error_middleware_1.AppError('Supplier not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const productCount = await this.repo.countDependencies(id);
        if (productCount > 0) {
            throw new error_middleware_1.AppError('Cannot delete supplier with associated products', 409 /* HttpStatus.CONFLICT */);
        }
        const success = await this.repo.delete(id);
        if (!success) {
            throw new error_middleware_1.AppError('Failed to delete supplier', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        }
        return { success: true };
    }
    mapToResponse(supplier) {
        return {
            id: supplier.id,
            name: supplier.name,
            contactInfo: typeof supplier.contactInfo === 'string' ? JSON.parse(supplier.contactInfo) : supplier.contactInfo,
            productCount: supplier.productCount ?? 0
        };
    }
}
exports.SupplierService = SupplierService;

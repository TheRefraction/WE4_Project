"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionService = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
class OptionService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getAllBySlotId(slotId) {
        const options = await this.repo.findAllBySlotId(slotId);
        return Promise.all(options.map((opt) => this.mapToResponse(opt)));
    }
    async getBySlotAndProduct(slotId, productId) {
        const res = await this.repo.findBySlotAndProduct(slotId, productId);
        if (!res)
            throw new error_middleware_1.AppError('Option not found', 404 /* HttpStatus.NOT_FOUND */);
        return this.mapToResponse(res);
    }
    async create(data) {
        const exisiting = await this.repo.findBySlotAndProduct(data.slotId, data.productId);
        if (exisiting) {
            throw new error_middleware_1.AppError('Option already exists', 409 /* HttpStatus.CONFLICT */);
        }
        if (data.displayOrder < 0) {
            throw new error_middleware_1.AppError('Display order cannot be negative', 400 /* HttpStatus.BAD_REQUEST */);
        }
        const res = await this.repo.create(data.slotId, data);
        return this.mapToResponse(res);
    }
    async update(slotId, data) {
        const exisiting = await this.repo.findBySlotAndProduct(slotId, data.productId);
        if (!exisiting) {
            throw new error_middleware_1.AppError('Option not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        if (data.displayOrder && data.displayOrder < 0) {
            throw new error_middleware_1.AppError('Display order cannot be negative', 400 /* HttpStatus.BAD_REQUEST */);
        }
        const upd = await this.repo.update(slotId, data);
        if (!upd) {
            throw new error_middleware_1.AppError('Failed to update option', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        }
        return this.mapToResponse(upd);
    }
    async delete(slotId, productId) {
        const res = await this.repo.findBySlotAndProduct(slotId, productId);
        if (!res)
            throw new error_middleware_1.AppError('Option not found', 404 /* HttpStatus.NOT_FOUND */);
        /* FIXME
        const productCount = await this.repo.countDependencies(id);
        if (productCount > 0) {
            throw new AppError('Cannot delete supplier with associated products', HttpStatus.CONFLICT);
        }*/
        const success = await this.repo.delete(slotId, productId);
        if (!success) {
            throw new error_middleware_1.AppError('Failed to delete option', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        }
        return { success: true };
    }
    mapToResponse(option) {
        return {
            slotId: option.slotId,
            productId: option.productId,
            priceDelta: option.priceDelta,
            isDefault: option.isDefault,
            displayOrder: option.displayOrder,
            name: option.name ?? null
        };
    }
}
exports.OptionService = OptionService;

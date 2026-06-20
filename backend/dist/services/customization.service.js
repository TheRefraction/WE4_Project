"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomizationService = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
class CustomizationService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getAll() {
        const slots = await this.repo.findAll();
        return Promise.all(slots.map((slot) => this.mapToResponse(slot)));
    }
    async getAllByProductId(productId) {
        const slots = await this.repo.findAllByProductId(productId);
        return Promise.all(slots.map((opt) => this.mapToResponse(opt)));
    }
    async getById(slotId) {
        const slot = await this.repo.findById(slotId);
        return this.mapToResponse(slot);
    }
    async create(dto) {
        const existingSlot = await this.repo.findByProductAndCategory(dto.productId, dto.categoryId);
        if (existingSlot) {
            throw new error_middleware_1.AppError('A customization slot for these product and category already exists', 409 /* HttpStatus.CONFLICT */);
        }
        if (dto.minSelect > dto.maxSelect) {
            throw new error_middleware_1.AppError('Min selection cannot be higher than max', 400 /* HttpStatus.BAD_REQUEST */);
        }
        if (dto.displayOrder < 0) {
            throw new error_middleware_1.AppError('Display order cannot be negative', 400 /* HttpStatus.BAD_REQUEST */);
        }
        const res = await this.repo.create(dto);
        return this.mapToResponse(res);
    }
    async update(id, dto) {
        const slot = await this.repo.findById(id);
        if (!slot) {
            throw new error_middleware_1.AppError('Product slot not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const minSelect = dto.minSelect ?? slot.minSelect;
        const maxSelect = dto.maxSelect ?? slot.maxSelect;
        if (maxSelect < minSelect)
            throw new error_middleware_1.AppError('Min selection cannot be higher than max', 400 /* HttpStatus.BAD_REQUEST */);
        if (dto.displayOrder && dto.displayOrder < 0) {
            throw new error_middleware_1.AppError('Display order cannot be negative', 400 /* HttpStatus.BAD_REQUEST */);
        }
        return await this.repo.update(id, dto);
    }
    async delete(id) {
        const slot = await this.repo.findById(id);
        if (!slot) {
            throw new Error('Customization slot not found');
        }
        const success = await this.repo.delete(id);
        return { success: success };
    }
    async mapToResponse(data) {
        return {
            id: data.id,
            productId: data.productId,
            categoryId: data.categoryId,
            categoryName: data.categoryName,
            minSelect: data.minSelect,
            maxSelect: data.maxSelect,
            displayOrder: data.displayOrder,
            options: data.options ?? []
        };
    }
}
exports.CustomizationService = CustomizationService;

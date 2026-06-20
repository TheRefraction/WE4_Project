"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomizationFacade = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
class CustomizationFacade {
    slotSvc;
    optionSvc;
    constructor(slotSvc, optionSvc) {
        this.slotSvc = slotSvc;
        this.optionSvc = optionSvc;
    }
    async getFullSlotsByProductId(productId) {
        const result = [];
        const slotsRaw = await this.slotSvc.getAllByProductId(productId);
        for (const slot of slotsRaw) {
            const optionsRaw = await this.optionSvc.getAllBySlotId(slot.id);
            const fullSlot = {
                ...slot, // Destructuring
                options: optionsRaw.map(opt => ({
                    ...opt
                }))
            };
            result.push(fullSlot);
        }
        return result;
    }
    async getFullSlotById(slotId) {
        const slotRaw = await this.slotSvc.getById(slotId);
        const optionsRaw = await this.optionSvc.getAllBySlotId(slotId);
        const result = {
            ...slotRaw, // Destructuring
            options: optionsRaw.map(opt => ({
                ...opt
            }))
        };
        return result;
    }
    async addOptionToSlot(dto) {
        const slot = await this.slotSvc.getById(dto.slotId);
        if (!slot) {
            throw new error_middleware_1.AppError('Target customization slot not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const option = await this.optionSvc.create(dto);
        if (!option) {
            throw new error_middleware_1.AppError('The option could not be added to the slot', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        }
        return await this.getFullSlotById(dto.slotId);
    }
    // FIXME
    async removeOptionFromSlot(slotId, productId) {
        const option = await this.optionSvc.getBySlotAndProduct(slotId, productId);
        if (!option) {
            throw new error_middleware_1.AppError('Target option not found in this customization slot', 404 /* HttpStatus.NOT_FOUND */);
        }
        const success = await this.optionSvc.delete(slotId, productId);
        return success;
    }
}
exports.CustomizationFacade = CustomizationFacade;

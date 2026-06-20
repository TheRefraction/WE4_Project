"use strict";
/**
 * menu.service.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
class MenuService {
    repo;
    productFcd;
    constructor(repo, productFcd) {
        this.repo = repo;
        this.productFcd = productFcd;
    }
    async getAll(showHidden = true) {
        const menus = await this.repo.findAll(showHidden);
        return Promise.all(menus.map(menu => this.mapToResponse(menu)));
    }
    async getById(id) {
        const menu = await this.repo.findById(id);
        if (!menu) {
            throw new error_middleware_1.AppError('Menu not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        return this.mapToResponse(menu);
    }
    async create(dto) {
        const menu = await this.repo.create(dto);
        return this.mapToResponse(menu);
    }
    async update(id, dto) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new error_middleware_1.AppError('Menu not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const menu = await this.repo.update(id, dto);
        if (!menu)
            throw new error_middleware_1.AppError('Failed to update menu', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        return this.mapToResponse(menu);
    }
    async delete(id) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new error_middleware_1.AppError('Menu not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const success = await this.repo.delete(id);
        return { success };
    }
    async mapToResponse(menu) {
        const slotsRaw = await this.repo.findSlotsByMenuId(menu.id);
        const slots = await Promise.all(slotsRaw.map(async (slot) => {
            const slotProdsRaw = await this.repo.findProductsBySlotId(slot.id);
            const products = await Promise.all(slotProdsRaw.map(async (sp) => {
                const fullProd = await this.productFcd.getFullProduct(sp.id);
                return {
                    ...fullProd,
                    priceDelta: parseFloat(sp.priceDelta || 0),
                    isDefault: sp.isDefault
                };
            }));
            return {
                id: slot.id,
                name: slot.name,
                minSelect: slot.minSelect,
                maxSelect: slot.maxSelect,
                displayOrder: slot.displayOrder,
                products
            };
        }));
        const productsRaw = await this.repo.findProductsByMenuId(menu.id);
        const products = await Promise.all(productsRaw.map(prod => this.productFcd.getFullProduct(prod.id)));
        return {
            id: menu.id,
            name: menu.name,
            description: menu.description ?? null,
            price: parseFloat(menu.price),
            hidden: menu.hidden,
            pictureUrl: menu.pictureUrl ?? null,
            products,
            slots
        };
    }
}
exports.MenuService = MenuService;

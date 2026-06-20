/**
 * menu.service.ts
 */

import { MenuRepository } from '../repositories/menu.repository';
import { ProductFacade } from './product.facade';
import { MenuResponse, CreateMenuDTO, UpdateMenuDTO } from '../models/menu.model';
import { AppError } from '../middlewares/error.middleware';
import { HttpStatus } from '../utils/httpStatus';

export class MenuService {
    constructor(private repo: MenuRepository, private productFcd: ProductFacade) {}

    async getAll(showHidden = true): Promise<MenuResponse[]> {
        const menus = await this.repo.findAll(showHidden);
        return Promise.all(menus.map(menu => this.mapToResponse(menu)));
    }

    async getById(id: number): Promise<MenuResponse> {
        const menu = await this.repo.findById(id);
        if (!menu) {
            throw new AppError('Menu not found', HttpStatus.NOT_FOUND);
        }
        return this.mapToResponse(menu);
    }

    async create(dto: CreateMenuDTO): Promise<MenuResponse> {
        const menu = await this.repo.create(dto);
        return this.mapToResponse(menu);
    }

    async update(id: number, dto: UpdateMenuDTO): Promise<MenuResponse> {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new AppError('Menu not found', HttpStatus.NOT_FOUND);
        }
        const menu = await this.repo.update(id, dto);
        if (!menu) throw new AppError('Failed to update menu', HttpStatus.INTERNAL_SERVER_ERROR);
        return this.mapToResponse(menu);
    }

    async delete(id: number): Promise<{ success: boolean }> {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new AppError('Menu not found', HttpStatus.NOT_FOUND);
        }
        const success = await this.repo.delete(id);
        return { success };
    }

    private async mapToResponse(menu: any): Promise<MenuResponse> {
        const slotsRaw = await this.repo.findSlotsByMenuId(menu.id);
        const slots = await Promise.all(
            slotsRaw.map(async (slot) => {
                const slotProdsRaw = await this.repo.findProductsBySlotId(slot.id);
                const products = await Promise.all(
                    slotProdsRaw.map(async (sp) => {
                        const fullProd = await this.productFcd.getFullProduct(sp.id);
                        return {
                            ...fullProd,
                            priceDelta: parseFloat(sp.priceDelta || 0),
                            isDefault: sp.isDefault
                        };
                    })
                );
                return {
                    id: slot.id,
                    name: slot.name,
                    minSelect: slot.minSelect,
                    maxSelect: slot.maxSelect,
                    displayOrder: slot.displayOrder,
                    products
                };
            })
        );

        const productsRaw = await this.repo.findProductsByMenuId(menu.id);
        const products = await Promise.all(
            productsRaw.map(prod => this.productFcd.getFullProduct(prod.id))
        );

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

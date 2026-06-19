import { CustomizationOptionResponse, CreateCustomizationOptionDTO, UpdateCustomizationOptionDTO } from '../models/option.model';
import { CustomizationOptionRepository } from '../repositories/option.repository';
import { AppError } from '../middlewares/error.middleware';

export class OptionService {
    constructor(private repo: CustomizationOptionRepository){ }

    async getAllBySlotId(slotId: number): Promise<CustomizationOptionResponse[]> {
        const options = await this.repo.findAllBySlotId(slotId);
        return Promise.all(options.map((opt) => this.mapToResponse(opt)));
    }

    async getBySlotAndProduct(slotId: number, productId: number): Promise<CustomizationOptionResponse | null> {
        const res = await this.repo.findBySlotAndProduct(slotId, productId);
        if (!res) throw new AppError('Option not found', 404);

        return this.mapToResponse(res);
    }

    async create(data: CreateCustomizationOptionDTO): Promise<CustomizationOptionResponse> {
        const exisiting = await this.repo.findBySlotAndProduct(data.slotId, data.productId);
        if (exisiting) {
            throw new AppError('Option already exists', 409);
        }

        if (data.displayOrder < 0) {
            throw new AppError('Display order cannot be negative', 400);
        }

        const res = await this.repo.create(data.slotId, data);
        return this.mapToResponse(res);
    }

    async update(slotId: number, data: UpdateCustomizationOptionDTO): Promise<CustomizationOptionResponse> {
        const exisiting = await this.repo.findBySlotAndProduct(slotId, data.productId);
        if (exisiting) {
            throw new AppError('Option already exists', 409);
        }

        if (data.displayOrder && data.displayOrder < 0) {
            throw new AppError('Display order cannot be negative', 400);
        }

        const upd = await this.repo.update(slotId, data);
        if (!upd) {
            throw new AppError('Failed to update option', 500);
        }

        return this.mapToResponse(upd);
    }

    async delete(slotId: number, productId: number): Promise<{ success: boolean }> {
        const res = await this.repo.findBySlotAndProduct(slotId, productId);
        if (!res) throw new AppError('Option not found', 404);

        /* FIXME 
        const productCount = await this.repo.countDependencies(id);
        if (productCount > 0) {
            throw new AppError('Cannot delete supplier with associated products', 409);
        }*/

        const success = await this.repo.delete(slotId, productId);
        if (!success) {
            throw new AppError('Failed to delete supplier', 500);
        }

        return { success: true };
    }

    private mapToResponse(option: any): CustomizationOptionResponse {
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
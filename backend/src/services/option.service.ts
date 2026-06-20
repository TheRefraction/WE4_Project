import { CustomizationOptionResponse, CreateCustomizationOptionDTO, UpdateCustomizationOptionDTO } from '../models/option.model';
import { CustomizationOptionRepository } from '../repositories/option.repository';
import { AppError } from '../middlewares/error.middleware';
import { HttpStatus } from '../utils/httpStatus';

export class OptionService {
    constructor(private repo: CustomizationOptionRepository){ }

    async getAllBySlotId(slotId: number): Promise<CustomizationOptionResponse[]> {
        const options = await this.repo.findAllBySlotId(slotId);
        return Promise.all(options.map((opt) => this.mapToResponse(opt)));
    }

    async getBySlotAndProduct(slotId: number, productId: number): Promise<CustomizationOptionResponse | null> {
        const res = await this.repo.findBySlotAndProduct(slotId, productId);
        if (!res) throw new AppError('Option not found', HttpStatus.NOT_FOUND);

        return this.mapToResponse(res);
    }

    async create(data: CreateCustomizationOptionDTO): Promise<CustomizationOptionResponse> {
        const exisiting = await this.repo.findBySlotAndProduct(data.slotId, data.productId);
        if (exisiting) {
            throw new AppError('Option already exists', HttpStatus.CONFLICT);
        }

        if (data.displayOrder < 0) {
            throw new AppError('Display order cannot be negative', HttpStatus.BAD_REQUEST);
        }

        const res = await this.repo.create(data.slotId, data);
        return this.mapToResponse(res);
    }

    async update(slotId: number, data: UpdateCustomizationOptionDTO): Promise<CustomizationOptionResponse> {
        const exisiting = await this.repo.findBySlotAndProduct(slotId, data.productId);
        if (!exisiting) {
            throw new AppError('Option not found', HttpStatus.NOT_FOUND);
        }

        if (data.displayOrder && data.displayOrder < 0) {
            throw new AppError('Display order cannot be negative', HttpStatus.BAD_REQUEST);
        }

        const upd = await this.repo.update(slotId, data);
        if (!upd) {
            throw new AppError('Failed to update option', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return this.mapToResponse(upd);
    }

    async delete(slotId: number, productId: number): Promise<{ success: boolean }> {
        const res = await this.repo.findBySlotAndProduct(slotId, productId);
        if (!res) throw new AppError('Option not found', HttpStatus.NOT_FOUND);

        /* FIXME 
        const productCount = await this.repo.countDependencies(id);
        if (productCount > 0) {
            throw new AppError('Cannot delete supplier with associated products', HttpStatus.CONFLICT);
        }*/

        const success = await this.repo.delete(slotId, productId);
        if (!success) {
            throw new AppError('Failed to delete option', HttpStatus.INTERNAL_SERVER_ERROR);
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
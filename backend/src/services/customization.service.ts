import { CustomizationSlotResponse, CreateCustomizationSlotDTO, UpdateCustomizationSlotDTO } from '../models/customization.model';
import { CustomizationSlotRepository } from '../repositories/customization.repository';
import { AppError } from '../middlewares/error.middleware';
import { HttpStatus } from '../utils/httpStatus';

export class CustomizationService {
    constructor(private repo: CustomizationSlotRepository){}

    async getAll(): Promise<CustomizationSlotResponse[]> {
        const slots = await this.repo.findAll();
        return Promise.all(slots.map((slot) => this.mapToResponse(slot)));
    }

    async getAllByProductId(productId: number): Promise<CustomizationSlotResponse[]> {
        const slots = await this.repo.findAllByProductId(productId);
        return Promise.all(slots.map((opt) => this.mapToResponse(opt)));
    }

    async getById(slotId: number): Promise<CustomizationSlotResponse> {
        const slot = await this.repo.findById(slotId);

        return this.mapToResponse(slot);
    }

    async create(dto: CreateCustomizationSlotDTO): Promise<any> {
        const existingSlot = await this.repo.findByProductAndCategory(dto.productId, dto.categoryId);

        if (existingSlot) {
            throw new AppError('A customization slot for these product and category already exists', HttpStatus.CONFLICT);
        }

        if (dto.minSelect > dto.maxSelect) {
            throw new AppError('Min selection cannot be higher than max', HttpStatus.BAD_REQUEST);
        }

        if (dto.displayOrder < 0) {
            throw new AppError('Display order cannot be negative', HttpStatus.BAD_REQUEST);
        }

        const res = await this.repo.create(dto);
        return this.mapToResponse(res);
    }

    async update(id: number, dto: UpdateCustomizationSlotDTO) : Promise<any>{
        const slot = await this.repo.findById(id);
        if (!slot) {
            throw new AppError ('Product slot not found', HttpStatus.NOT_FOUND);
        }

        const minSelect : number = dto.minSelect ?? slot.minSelect;
        const maxSelect : number = dto.maxSelect ?? slot.maxSelect;

        if (maxSelect < minSelect) throw new AppError('Min selection cannot be higher than max', HttpStatus.BAD_REQUEST);

        if (dto.displayOrder && dto.displayOrder < 0) {
            throw new AppError('Display order cannot be negative', HttpStatus.BAD_REQUEST);
        }

        return await this.repo.update(id, dto);
    }

    async delete(id: number): Promise<{success: boolean}> {
        const slot = await this.repo.findById(id);
        if(!slot){
            throw new Error('Customization slot not found');
        }

        const success = await this.repo.delete(id);
        return { success: success };
    }

    private async mapToResponse(data: any): Promise<CustomizationSlotResponse> {
        return {
            id: data.id,
            productId: data.productId,
            categoryId: data.categoryId,
            minSelect: data.minSelect,
            maxSelect: data.maxSelect,
            displayOrder: data.displayOrder,
            options: data.options ?? []
        };
    }
}
import { CreateCustomizationOptionDTO } from '../models/option.model';
import { CustomizationSlotResponse } from '../models/customization.model';
import { CustomizationService } from './customization.service';
import { OptionService } from './option.service';
import { AppError } from '../middlewares/error.middleware';
import { HttpStatus } from '../utils/httpStatus';

export class CustomizationFacade {
    constructor(private slotSvc: CustomizationService, private optionSvc: OptionService) {}

    async getFullSlotsByProductId(productId: number): Promise<CustomizationSlotResponse[]> {
        const result: CustomizationSlotResponse[] = [];

        const slotsRaw = await this.slotSvc.getAllByProductId(productId);

        for (const slot of slotsRaw) {
            const optionsRaw = await this.optionSvc.getAllBySlotId(slot.id);
            
            const fullSlot: CustomizationSlotResponse = {
                ...slot, // Destructuring
                options: optionsRaw.map(opt => ({
                    ...opt
                }))
            };

            result.push(fullSlot);
        }

        return result;
    }

    async getFullSlotById(slotId: number): Promise<CustomizationSlotResponse> {
        const slotRaw = await this.slotSvc.getById(slotId);
        const optionsRaw = await this.optionSvc.getAllBySlotId(slotId);

        const result: CustomizationSlotResponse = {
            ...slotRaw, // Destructuring
            options: optionsRaw.map(opt => ({
                ...opt
            }))
        };

        return result;
    }

    async addOptionToSlot(dto: CreateCustomizationOptionDTO): Promise<CustomizationSlotResponse> {
        const slot = await this.slotSvc.getById(dto.slotId);
        if (!slot){
            throw new AppError('Target customization slot not found', HttpStatus.NOT_FOUND);
        }

        const option = await this.optionSvc.create(dto);
        if (!option) {
            throw new AppError('The option could not be added to the slot', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return await this.getFullSlotById(dto.slotId);
    }

    // FIXME
    async removeOptionFromSlot(slotId: number, productId: number): Promise <{success: boolean}> {
        const option = await this.optionSvc.getBySlotAndProduct(slotId, productId);
        if (!option) {
            throw new AppError('Target option not found in this customization slot', HttpStatus.NOT_FOUND);
        }

        const success = await this.optionSvc.delete(slotId, productId);
        return success;
    }
}
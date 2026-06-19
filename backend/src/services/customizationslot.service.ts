import { CustomizationRepository} from '../repositories/customization.repository';
import {
    CreateCustomizationSlotDTO,
    CustomizationSlotResponse,
} from '../models/customization.model';

export class CustomizationService {
    private customizationRepository: CustomizationRepository;


    constructor(){
        this.customizationRepository = new CustomizationRepository();
    }

    //services for slots

    async getAllSlots(): Promise<CustomizationSlotResponse[]> {
        const slotsRaw = await this.customizationRepository.findAllSlots();
        const fullSlots: CustomizationSlotResponse[] = [];

        for (const slot of slotsRaw) {
            const optionsRaw = await this.customizationRepository.findOptionsBySlotId(slot.id);
            
            fullSlots.push({
                id: slot.id,
                productId: slot.productId,
                categoryId: slot.categoryId,
                categoryName: slot.categoryName,
                minSelect: slot.minSelect,
                maxSelect: slot.maxSelect,
                displayOrder: slot.displayOrder,
                options: optionsRaw.map(opt => ({
                    productId: opt.productId,
                    optionName: opt.optionProductName,
                    basePrice: parseFloat(opt.basePrice),
                    priceDelta: parseFloat(opt.priceDelta),
                    isDefault: opt.isDefault,
                    displayOrder: opt.displayOrder
                }))
            });
        }
    return fullSlots;

    }


    async getSlotsByProductId(productId: number): Promise<CustomizationSlotResponse[]> {
        const slotsRaw = await this.customizationRepository.findSlotsByProductId(productId);
        const fullSlots: CustomizationSlotResponse[] = [];

        for (const slot of slotsRaw) {
            const optionsRaw = await this.customizationRepository.findOptionsBySlotId(slot.id);
            
            fullSlots.push({
                id: slot.id,
                productId: slot.productId,
                categoryId: slot.categoryId,
                categoryName: slot.categoryName,
                minSelect: slot.minSelect,
                maxSelect: slot.maxSelect,
                displayOrder: slot.displayOrder,
                options: optionsRaw.map(opt => ({
                    productId: opt.productId,
                    optionName: opt.optionProductName,
                    basePrice: parseFloat(opt.basePrice),
                    priceDelta: parseFloat(opt.priceDelta),
                    isDefault: opt.isDefault,
                    displayOrder: opt.displayOrder
                }))
            });
        }

        return fullSlots;
    }

    async createSlot(dto: CreateCustomizationSlotDTO): Promise<any> {
        const existingSlot = await this.customizationRepository.findSlotByProductAndCategory(
            dto.product_id, 
            dto.category_id
        );
        if (existingSlot) {
            throw new Error('A customization slot for this product and category already exists');
        }

        return await this.customizationRepository.createSlot(dto);
    }


    async updateSlot(id: number, minSelect: number, maxSelect: number, displayOrder: number) : Promise<any>{
        const slot = await this.customizationRepository.findSlotById(id);
        if (!slot) {
            throw new Error ('Customization slot not found');
        }
        return await this.customizationRepository.updateSlot(id, minSelect, maxSelect, displayOrder);
    }

    async deleteSlot(id: number): Promise<{success: boolean}> {
        const slot = await this.customizationRepository.findSlotById(id);
        if(!slot){
            throw new Error('Customization slot not found');
        }
        const success = await this.customizationRepository.deleteSlot(id);
        return {success};
    }


    //services for slots options

    async addOptionToSlot(slotId: number, dto: CreateCustomizationOptionDTO): Promise<any> {
        const slot = await this.customizationRepository.findSlotById(slotId);
        if (!slot){
            throw new Error('Target customization slot not found');
        }
        const existingOption = await this.customizationRepository.findOptionBySlotAndProduct(slotId, dto.product_id);
        if (existingOption){
            throw new Error('This product is already an option in this customization slot');
        }
        return await this.customizationRepository.createOption(slotId,dto);
    }

    async updateOption(slotId : number, productId: number, priceDelta: number, isDefault: boolean, displayOrder: number): Promise<any>{
        const option = await this.customizationRepository.findOptionBySlotAndProduct(slotId, productId);
        if (!option){
            throw new Error ('Option not found in this customization slot');
        }
        return await this.customizationRepository.updateOption(slotId, productId, priceDelta, isDefault, displayOrder);
    }

    async removeOptionFromSlot(slotId: number, productId: number): Promise <{success: boolean}> {
        const option = await this.customizationRepository.findOptionBySlotAndProduct(slotId, productId);
        if (!option){
            throw new Error ('Option not found in this customization slot');
        }
        const success = await this.customizationRepository.deleteOption(slotId, productId);
        return {success };


    }






}
import {Request, Response, NextFunction} from 'express';
import { CustomizationService } from '../services/customizationslot.service';

const customizationService = new CustomizationService();

export class CustomizationController{

    //slots controller

    async getAllSlots(req: Request, res : Response, next : NextFunction): Promise<void> {
        try {
            const slots = await customizationService.getAllSlots();
            res.status(200).json({
                success: true,
                data : slots
            });
        }catch(error){
            next(error);
        }
    }




    async getSlotsByProductId(req: Request, res: Response, next : NextFunction): Promise<void>{
        try {
            const productId = parseInt(req.params.productId, 10);
            if (isNaN(productId)){
                res.status(400).json({success: false, message: 'Invalid product ID'});
            }
            const slots = await customizationService.getSlotsByProductId(productId);
            res.status(200).json({
                success: true, 
                data : slots
            });
        } catch(error){
            next(error);
        }
    }


    async createSlot(req: Request, res : Response, next: NextFunction): Promise<void>{
        try {
            const newSlot = await customizationService.createSlot(req.body);
            res.status(201).json({
                success: true,
                message: 'Customization slot created successfully',
                data: newSlot
            });
        }catch (error){
            next(error);
        }
    }


    async updateSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt (req.params.id, 10);
            if (isNaN(id)){
                res.status(400).json ({
                    success: false, message: 'Invalid slot ID'
                });
                return;
            }
            const {minSelect, maxSelect, displayOrder} = req.body;
            const updatedSlot = await customizationService.updateSlot(id,minSelect,maxSelect,displayOrder);
            
            res.status(200).json({
                success: true,
                message: 'Customization slot updated successfully',
                data: updatedSlot
            });
        }catch (error){
            next(error);
        }
    }



    async deleteSlot(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)){
                res.status(400).json({
                    success: false,
                    message: 'Not valid slot ID'
                });
                return;
            }
            await customizationService.deleteSlot(id);
            res.status(200).json({
                success: true,
                message : 'Customization slot deleted successfully'
            });
        } catch (error){
            next (error);
        }
    }


    //options slots controller

    async addOption(req: Request, res: Response, next: NextFunction): Promise <void>{
        try{
            const slotId = parseInt (req.params.slotId, 10)
            if (isNaN(slotId)){
                res.status(400).json({
                    success: false,
                    message: 'Invalid slot ID'
                });
                return;
            }
            const newOption = await customizationService.addOptionToSlot(slotId, req.body);
            res.status(201).json({
                success: true,
                message : 'Option added successfully',
                data : newOption
            });
        }catch (error){
            next(error);
        }
    }


    async updateOption(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const slotId = parseInt (req.params.slotId,10);
            const productId = parseInt(req.params.productId,10);
            if (isNaN(slotId) || isNaN(productId)){
                res.status(400).json({
                    success: false,
                    message: 'Invalid slot or product ID'
                });
                return;
            }
            const {priceDelta, isDefault, displayOrder} = req.body;
            const updatedOption = await customizationService.updateOption(slotId, productId, priceDelta, isDefault, displayOrder);

            res.status(200).json({
                success: true, 
                message: 'Option updated successfully',
                data: updatedOption
            });
        }catch(error){
            next(error);
        }
    }


    async removeOption(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const slotId = parseInt(req.params.slotId, 10);
            const productId = parseInt(req.params.productId, 10);
            if (isNaN(slotId) || isNaN(productId)){
                res.status(400).json({
                    success: false,
                    message: 'Invalid slot or product ID'
                });
                return;
            }
            await customizationService.removeOptionFromSlot(slotId, productId);
            res.status(200).json({
                success: true,
                message: 'Option removed from slot successfully'
            });   
        }catch(error){
            next(error);
        }
    }
}
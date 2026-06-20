import {Request, Response, NextFunction} from 'express';
import { BaseController } from './base.controller';
import { HttpStatus } from '../utils/httpStatus';
import { CustomizationFacade } from '../services/customization.facade';
import { OptionService } from '../services/option.service';

export class OptionController extends BaseController {
    constructor(
        private optSvc: OptionService, 
        private slotFcd: CustomizationFacade
    ) { 
        super(); 
    }

    async getAllBySlotId(req: Request, res: Response, next : NextFunction): Promise<void>{
        try {
            const slotId = parseInt(req.params.id);

            const opt = await this.optSvc.getAllBySlotId(slotId);

            this.sendResponse(res, HttpStatus.OK, 'Option retrieved', opt);
        } catch(error){
            next(error);
        }
    }

    async getBySlotAndProduct(req: Request, res: Response, next : NextFunction): Promise<void>{
        try {
            const slotId = parseInt(req.params.id);

            const opt = await this.optSvc.getBySlotAndProduct(slotId, req.body);

            this.sendResponse(res, HttpStatus.OK, 'Option retrieved', opt);
        } catch(error){
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise <void>{
        try{
            const result = await this.slotFcd.addOptionToSlot(req.body);

            this.sendResponse(res, HttpStatus.CREATED, 'Option added successfully', result);
        }catch (error){
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const slotId = parseInt (req.params.id);

            const result = await this.optSvc.update(slotId, req.body);

            this.sendResponse(res, HttpStatus.OK, 'Option updated successfully', result)
        }catch(error){
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const slotId = parseInt(req.params.id);

            await this.slotFcd.removeOptionFromSlot(slotId, req.body);

            this.sendResponse(res, HttpStatus.OK, 'Option removed successfully');  
        }catch(error){
            next(error);
        }
    }
}
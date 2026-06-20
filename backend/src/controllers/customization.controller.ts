import {Request, Response, NextFunction} from 'express';
import { CustomizationService } from '../services/customization.service';
import { BaseController } from './base.controller';
import { HttpStatus } from '../utils/httpStatus';
import { CustomizationFacade } from '../services/customization.facade';

export class CustomizationController extends BaseController {
    constructor(
        private slotSvc: CustomizationService, 
        private slotFcd: CustomizationFacade
    ) { 
        super(); 
    }

    async getAll(req: Request, res : Response, next : NextFunction): Promise<void> {
        try {
            const slots = await this.slotSvc.getAll();

            this.sendResponse(res, HttpStatus.OK, 'Slots retrieved', slots);
        }catch(error){
            next(error);
        }
    }

    async getAllByProductId(req: Request, res: Response, next : NextFunction): Promise<void>{
        try {
            const productId = parseInt(req.params.productId);
            if (isNaN(productId)) {
                this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid slot ID');
                return;
            }

            const slots = await this.slotSvc.getAllByProductId(productId);

            this.sendResponse(res, HttpStatus.OK, 'Slots retrieved', slots);
        } catch(error){
            next(error);
        }
    }

    

    async create(req: Request, res : Response, next: NextFunction): Promise<void>{
        try {
            const slot = await this.slotSvc.create(req.body);

            this.sendResponse(res, HttpStatus.CREATED, 'Slot created succesfully', slot);
        }catch (error){
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid slot ID');
                return;
            }

            const slot = await this.slotSvc.update(id, req.body);
            
            this.sendResponse(res, HttpStatus.OK, 'Slot updated succesfully', slot);
        }catch (error){
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid slot ID');
                return;
            }

            await this.slotSvc.delete(id);

            this.sendResponse(res, HttpStatus.OK, 'Slot deleted succesfully');
        } catch (error){
            next (error);
        }
    }
}
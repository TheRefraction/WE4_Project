import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/supplier.service';
import { BaseController } from './base.controller';
import { HttpStatus } from '../utils/httpStatus';

export class SupplierController extends BaseController {
    constructor(private supplierSvc: SupplierService) { super(); }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.supplierSvc.getAll();

            this.sendResponse(res, HttpStatus.OK, 'Suppliers retrieved successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const sanId : number = parseInt(id);
            if (isNaN(sanId)) {
                this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid supplier ID');
                return;
            }

            const result = await this.supplierSvc.getById(sanId);

            this.sendResponse(res, HttpStatus.OK, 'Supplier retrieved successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.supplierSvc.create(req.body);

            this.sendResponse(res, HttpStatus.CREATED, 'Supplier created successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const sanId = parseInt(id);
            if (isNaN(sanId)) {
                this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid supplier ID');
                return;
            }

            const result = await this.supplierSvc.update(sanId, req.body);

            this.sendResponse(res, HttpStatus.OK, 'Supplier updated successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const sanId = parseInt(id);
            if (isNaN(sanId)) {
                this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid supplier ID');
                return;
            }

            await this.supplierSvc.delete(sanId);

            this.sendResponse(res, HttpStatus.OK, 'Supplier deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}
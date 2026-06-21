/**
 * payment.controller.ts 
 */

import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { HttpStatus } from '../utils/httpStatus';
import { BaseController } from './base.controller';

export class PaymentController extends BaseController {
    constructor(private service: PaymentService) { super(); }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.service.getAll();

            this.sendResponse(res, HttpStatus.CREATED, 'Payments retrieved', result);
        } catch (error: any) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            
            const result = await this.service.getById(id);

            this.sendResponse(res, HttpStatus.CREATED, 'Payment retrieved', result);
        } catch (error: any) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.service.create(req.body);

            this.sendResponse(res, HttpStatus.CREATED, 'Payment created successfully', result);
        } catch (error: any) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            const result = await this.service.update(id, req.body);

            this.sendResponse(res, HttpStatus.CREATED, 'Payment updated successfully', result);
        } catch (error: any) {
            next(error);
        }
    };
} 
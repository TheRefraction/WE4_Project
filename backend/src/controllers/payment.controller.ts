/**
 * payment.controller.ts 
 */

import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();

export class PaymentController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await paymentService.create(req.body);

            return res.status(201).json({
                success: true,
                message: "Payment created successfully",
                data: result 
            });
        } catch (error : any) {
            next(error);
        }
    };
} 
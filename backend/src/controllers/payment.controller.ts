import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();


export class PaymentController {
    private paymentService = new PaymentService();

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { status } = req.body;
            const paymentId = await paymentService.sendPaymentInfo(status);

            return res.status(201).json({
                success: true,
                message: "Payment created successfully",
                data: { id: paymentId }
            });
        } catch (error : any) {
            return res.status(500).json({
                success: false,
                message: (error as Error).message
            });
        }
    };
} 
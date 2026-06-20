import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from '../services/invoice.service';

const invoiceService = new InvoiceService();

export class InvoiceController {


    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const invoiceData = req.body;
            const createdInvoice = await invoiceService.createInvoice(invoiceData);

            res.status(201).json({
                success: true,
                message: "Invoice created successfully",
                data: {
                    id: createdInvoice.id
                }
            });
        } catch (error) {
            next(error);
        }
    }


    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const invoiceId = parseInt(req.params.id, 10);
            const fullInvoice = await invoiceService.getInvoiceData(invoiceId);

            res.status(200).json({
                success: true,
                data: fullInvoice
            });
        } catch (error) {
            next(error);
        }
    }
}
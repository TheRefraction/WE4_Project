import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from '../services/invoice.service';

const invoiceService = new InvoiceService();

export class InvoiceController {


    create = async (req: Request, res: Response, next: NextFunction) => {
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


    getById = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const invoiceId = parseInt(req.params.id);
            const fullInvoice = await invoiceService.getInvoiceData(invoiceId);

            res.status(200).json({
                success: true,
                data: fullInvoice
            });
        } catch (error) {
            next(error);
        }
    }

    getAll = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const invoices = await invoiceService.getAllInvoices();
            res.status(200).json({
                success: true,
                message: "Invoices retrieved successfully",
                data: invoices
            });
        } catch (error) {
            next(error);
        }
    }

    updateStatus = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const { status } = req.body;
            await invoiceService.updateInvoiceStatus(id, status);
            res.status(200).json({
                success: true,
                message: "Invoice status updated successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
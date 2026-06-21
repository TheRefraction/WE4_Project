import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { BaseController } from './base.controller';
import { PaymentService } from '../services/payment.service';
import { HttpStatus } from '../utils/httpStatus';
import { PaymentResponse, CreatePaymentDTO, PaymentMode, PaymentStatus} from '../models/payment.model';
import { InvoiceStatus } from '../models/invoice.model';

export class InvoiceController extends BaseController {
    constructor(private invoiceSvc: InvoiceService, private paymentSvc: PaymentService) { super(); }

    getById = async(req: Request, res: Response, next: NextFunction): Promise<void>  => {
        try {
            const invoiceId = parseInt(req.params.id);
            const fullInvoice = await this.invoiceSvc.getById(invoiceId);

            this.sendResponse(res, HttpStatus.OK, 'Invoice retrieved', fullInvoice);
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
        try {
            const invoiceData = {
                ...req.body,
                status: InvoiceStatus.Paid // SIMULATING
            };
            const invoiceRaw = await this.invoiceSvc.create(invoiceData);

            // SIMULATING PAYMENT HERE
            const paymentData : CreatePaymentDTO = {
                mode: PaymentMode.CreditCard,
                status: PaymentStatus.Paid,
                paymentDate: new Date()
            };
            const payment : PaymentResponse = await this.paymentSvc.create(paymentData);

            invoiceRaw.paymentId = payment.id;
            invoiceRaw.payment = payment;

            this.sendResponse(res, HttpStatus.CREATED, 'Invoice created successfully', invoiceRaw);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            const result = await this.invoiceSvc.update(id, req.body);

            this.sendResponse(res, HttpStatus.OK, 'Invoice updated successfully', result);
        } catch (error) {
            next(error);
        }
    } 

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
        try {
            const id = parseInt(req.params.id);

            await this.invoiceSvc.delete(id);

            this.sendResponse(res, HttpStatus.OK, 'Invoice deleted successfully');
        } catch (error) {
            next(error);
        }
    } 
}
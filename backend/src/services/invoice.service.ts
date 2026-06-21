import { InvoiceRepository } from "../repositories/invoice.repository";
import { CreateInvoiceDTO, InvoiceResponse, InvoiceStatus, UpdateInvoiceDTO } from '../models/invoice.model';
import { AppError } from "../middlewares/error.middleware";
import { HttpStatus } from "../utils/httpStatus";

export class InvoiceService {
    constructor(private repository: InvoiceRepository) {}

    async getAll(): Promise<InvoiceResponse[]> {
        const invoices = await this.repository.findAll();

        return Promise.all(invoices.map((invoice) => this.mapToResponse(invoice)));
    }

    async getById(id: number): Promise<InvoiceResponse | null> {
        const invoice = await this.repository.findById(id);
        if (!invoice) throw new AppError('Invoice not found', HttpStatus.NOT_FOUND);

        return this.mapToResponse(invoice);
    }

    async create(data: CreateInvoiceDTO): Promise<InvoiceResponse>{
        const { items } = data;
        if (!items || items.length === 0 ){
            throw new AppError("Can't create invoice because cart is empty", HttpStatus.BAD_REQUEST);
        }

        return await this.repository.create(data);
    }

    async update(id: number, data: UpdateInvoiceDTO): Promise<InvoiceResponse> {
        const existingInvoice = await this.repository.findById(id);
        if (!existingInvoice) {
            throw new AppError('Invoice not found', HttpStatus.NOT_FOUND);
        }

        if (existingInvoice.status === InvoiceStatus.Paid) {
            throw new AppError('Cannot update an invoice that has already been paid', HttpStatus.FORBIDDEN);
        }

        if (data.status !== undefined && !Object.values(InvoiceStatus).includes(data.status)) {
            throw new AppError('Invalid status value', HttpStatus.BAD_REQUEST);
        }

        const updatedInvoice = await this.repository.update(id, data);
        if (!updatedInvoice) {
            throw new AppError('Failed to update invoice', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return this.mapToResponse(updatedInvoice);
    }

    async delete(id: number): Promise<{success: boolean}> {
        const invoice = await this.repository.findById(id);
        if (!invoice) {
            throw new AppError('Invoice not found', HttpStatus.NOT_FOUND);
        }

        if (invoice.status === InvoiceStatus.Paid) {
            throw new AppError("Cannot delete an invoice that has already been paid", HttpStatus.FORBIDDEN);
        }

        const success = await this.repository.delete(id);
        return { success: success };
    }

    private async mapToResponse(data: any): Promise<InvoiceResponse> {
        return {
            id: data.id,
            accountId: data.accountId,
            amount: data.amount,
            billingAddress: typeof data.billingAddress === 'string' ? JSON.parse(data.billingAddress) : data.billingAddress,
            items: data.items,
            status: data.status,
            paymentId: data.paymentId ?? null,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
    }
}
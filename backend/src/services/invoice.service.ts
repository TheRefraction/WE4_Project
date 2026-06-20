import { InvoiceRepository } from "../repositories/invoice.repository";
import {Invoice} from '../models/invoice.model';

export class InvoiceService {
    private invoiceRepository: InvoiceRepository;
    
    constructor() {
        this.invoiceRepository = new InvoiceRepository();
    }


    async createInvoice(invoiceData: any ): Promise<Invoice>{
        const {items} = invoiceData;
        if (!items || items.length === 0 ){
            throw new Error(" Can't create invoice because cart is empty");
        }
        return await this.invoiceRepository.createInvoiceWithItems(invoiceData);
    }


    async getInvoiceData(invoiceId : number){
        if (!invoiceId) {
            throw new Error("invoice ID is required");
        }
        const fullInvoice = await this.invoiceRepository.findInvoiceWithDetails(invoiceId);

        if (!fullInvoice){
            throw new Error ("Invoice not found");
        }

        return fullInvoice
    }

    async getAllInvoices() {
        const invoices = await this.invoiceRepository.findAllInvoices();
        return Promise.all(invoices.map(async (invoice) => {
            const details = await this.invoiceRepository.findInvoiceWithDetails(invoice.id);
            return details;
        }));
    }

    async updateInvoiceStatus(invoiceId: number, status: string) {
        if (!invoiceId) {
            throw new Error("invoice ID is required");
        }
        return await this.invoiceRepository.updateInvoiceStatus(invoiceId, status);
    }
}
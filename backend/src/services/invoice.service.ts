import { InvoiceRepository } from "../repositories/invoice.repository";
import {Invoice} from '../models/invoice.model';

export class InvoiceService {
    private invoiceRepository: InvoiceRepository;
    
    constructor() {
        this.invoiceRepository = new InvoiceRepository();
    }


    async createInvoice(invoiceData: any ): Promise<Invoice>{
        const {items} = invoiceData;
        if (!items || items.lenght === 0 ){
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
}
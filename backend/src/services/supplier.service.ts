import { SupplierRepository } from '../repositories/supplier.repository';
import { CreateSupplierDTO, UpdateSupplierDTO, SupplierResponse } from '../models/supplier.model';

export class SupplierService {
    private supplierRepository: SupplierRepository;

    constructor() {
        this.supplierRepository = new SupplierRepository();
    }

    async getAllSuppliers(): Promise<SupplierResponse[]> {
        const suppliers = await this.supplierRepository.findAll();
        return suppliers.map((supplier) => this.mapToResponse(supplier));
    }

    async getSupplierById(id: number): Promise<SupplierResponse | null> {
        const supplier = await this.supplierRepository.findById(id);
        if (!supplier) return null;
        return this.mapToResponse(supplier);
    }

    async createSupplier(data: CreateSupplierDTO): Promise<SupplierResponse> {
        const existingSupplier = await this.supplierRepository.findByName(data.name);
        if (existingSupplier) {
            throw new Error('Supplier with this name already exists');
        }
        const supplier = await this.supplierRepository.create(data);
        return this.mapToResponse(supplier);
    }

    async updateSupplier(id: number, data: UpdateSupplierDTO): Promise<SupplierResponse> {
        const existingSupplier = await this.supplierRepository.findById(id);
        if (!existingSupplier) {
            throw new Error('Supplier not found');
        }

        if (data.contactInfo) {
            data.contactInfo = {
                ...existingSupplier.contactInfo,
                ...data.contactInfo
            };
        }

        const updatedSupplier = await this.supplierRepository.update(id, data);
        if (!updatedSupplier) {
            throw new Error('Failed to update supplier');
        }
        return this.mapToResponse(updatedSupplier);
    }

    async deleteSupplier(id: number): Promise<{ success: boolean }> {
        const supplier = await this.supplierRepository.findById(id);
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        const productCount = await this.supplierRepository.countDependencies(id);
        if (productCount > 0) {
            throw new Error('Cannot delete supplier with associated products');
        }
        const success = await this.supplierRepository.delete(id);
        if (!success) {
            throw new Error('Failed to delete supplier');
        }
        return { success: true };
    }

    private mapToResponse(supplier: any): SupplierResponse {
        return {
            id: supplier.id,
            name: supplier.name,
            contactInfo: supplier.contactInfo, 
            productCount: supplier.productCount ?? 0
        };
    }
}
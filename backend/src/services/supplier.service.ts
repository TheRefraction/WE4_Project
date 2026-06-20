import { SupplierRepository } from '../repositories/supplier.repository';
import { CreateSupplierDTO, UpdateSupplierDTO, SupplierResponse } from '../models/supplier.model';
import { AppError } from '../middlewares/error.middleware';
import { HttpStatus } from '../utils/httpStatus';

export class SupplierService {
    constructor(private repo: SupplierRepository) {}

    async getAll(): Promise<SupplierResponse[]> {
        const suppliers = await this.repo.findAll();
        return Promise.all(suppliers.map((supplier) => this.mapToResponse(supplier)));
    }

    async getById(id: number): Promise<SupplierResponse | null> {
        const supplier = await this.repo.findById(id);
        if (!supplier) throw new AppError('Supplier not found', HttpStatus.NOT_FOUND);

        return this.mapToResponse(supplier);
    }

    async create(data: CreateSupplierDTO): Promise<SupplierResponse> {
        const existingSupplier = await this.repo.findByName(data.name);
        if (existingSupplier) {
            throw new AppError('Supplier with this name already exists', HttpStatus.CONFLICT);
        }

        const supplier = await this.repo.create(data);
        return this.mapToResponse(supplier);
    }

    async update(id: number, data: UpdateSupplierDTO): Promise<SupplierResponse> {
        const existingSupplier = await this.repo.findById(id);
        if (!existingSupplier) {
            throw new AppError('Supplier not found', HttpStatus.NOT_FOUND);
        }

        // Make sure to not lose data if only one attribute of contact is modified
        if (data.contactInfo) {
            data.contactInfo = {
                email: data.contactInfo.email ?? existingSupplier.contactInfo.email,
                phone: data.contactInfo.phone ?? existingSupplier.contactInfo.phone
            };
        }

        const updatedSupplier = await this.repo.update(id, data);
        if (!updatedSupplier) {
            throw new AppError('Failed to update supplier', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return this.mapToResponse(updatedSupplier);
    }

    async delete(id: number): Promise<{ success: boolean }> {
        const supplier = await this.repo.findById(id);
        if (!supplier) {
            throw new AppError('Supplier not found', HttpStatus.NOT_FOUND);
        }

        const productCount = await this.repo.countDependencies(id);
        if (productCount > 0) {
            throw new AppError('Cannot delete supplier with associated products', HttpStatus.CONFLICT);
        }

        const success = await this.repo.delete(id);
        if (!success) {
            throw new AppError('Failed to delete supplier', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return { success: true };
    }

    private mapToResponse(supplier: any): SupplierResponse {
        return {
            id: supplier.id,
            name: supplier.name,
            contactInfo: typeof supplier.contactInfo === 'string' ? JSON.parse(supplier.contactInfo) : supplier.contactInfo,
            productCount: supplier.productCount ?? 0
        };
    }
}
import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/supplier.service';

const supplierService = new SupplierService();

export class SupplierController {

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await supplierService.getAllSuppliers();
            res.json({ 
                success: true, 
                message: 'Suppliers retrieved successfully',
                data: result, 
                count: result.length });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const result = await supplierService.getSupplierById(parseInt(id, 10));

            if (!result) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Supplier not found' });
                return;
            }
            res.json({ 
                success: true, 
                message: 'Supplier retrieved successfully', 
                data: result });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await supplierService.createSupplier(req.body);
            res.status(201).json({ 
                success: true, 
                message: 'Supplier created successfully', 
                data: result });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const result = await supplierService.updateSupplier(parseInt(id, 10), req.body);
            res.json({ 
                success: true, 
                message: 'Supplier updated successfully', 
                data: result });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await supplierService.deleteSupplier(parseInt(id, 10));
            res.status(204).json({ 
                success: true, 
                message: 'Supplier deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { ProductFacade } from '../services/product.facade';
import { BaseController } from './base.controller';
import { HttpStatus } from '../utils/httpStatus';

export class ProductController extends BaseController {
    constructor(
        private productSvc: ProductService, 
        private productFcd: ProductFacade
    ) {
        super();
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const products = await this.productSvc.getAll();

            this.sendResponse(res, HttpStatus.OK, 'Products retrieved successfully', products);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) { 
                this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid product ID');
                return; 
            }

            const product = await this.productSvc.getById(id);
            
            this.sendResponse(res, HttpStatus.OK, 'Product retrieved', product);
        } catch (error) {
            next(error);
        }
    }

    async getFullProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) { 
                this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid product ID');
                return; 
            }

            const product = await this.productFcd.getFullProduct(id);
            
            this.sendResponse(res, HttpStatus.OK, 'Product retrieved', product);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.productSvc.create(req.body);

            this.sendResponse(res, HttpStatus.CREATED, 'Product created successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) { 
                this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid product ID');
                return; 
            }

            const result = await this.productSvc.update(id, req.body);

            this.sendResponse(res, HttpStatus.OK, 'Product updated successfully', result);
        } catch (error) {
           next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) { 
                this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid product ID');
                return; 
            }

            await this.productSvc.delete(id);

            this.sendResponse(res, HttpStatus.OK, 'Product deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}
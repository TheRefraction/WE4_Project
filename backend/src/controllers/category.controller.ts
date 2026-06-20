import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { BaseController } from './base.controller';
import { HttpStatus } from '../utils/httpStatus';

export class CategoryController extends BaseController {
    constructor(private categorySvc: CategoryService) { super(); }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categories = await this.categorySvc.getAll();

            this.sendResponse(res, HttpStatus.OK, 'Categories retrieved', categories);
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            const category = await this.categorySvc.getById(id);

            this.sendResponse(res, HttpStatus.OK, 'Category retrieved', category);
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newCategory = await this.categorySvc.create(req.body);

            this.sendResponse(res, HttpStatus.CREATED, 'Category created successfully', newCategory);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            const updatedCategory = await this.categorySvc.update(id, req.body);

            this.sendResponse(res, HttpStatus.OK, 'Category updated', updatedCategory);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            const result = await this.categorySvc.delete(id);

            this.sendResponse(res, HttpStatus.OK, 'Category deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}
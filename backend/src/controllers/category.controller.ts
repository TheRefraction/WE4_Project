import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

const categoryService = new CategoryService();

export class CategoryController {


    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            next(error);
        }
    }


    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'Invalid category ID' });
                return;
            }

            const category = await categoryService.getCategoryById(id);
            res.status(200).json({
                success: true,
                data: category
            });
        } catch (error) {
            next(error);
        }
    }


    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newCategory = await categoryService.createCategory(req.body);
            res.status(201).json({
                success: true,
                message: 'Category created successfully',
                data: newCategory
            });
        } catch (error) {
            next(error);
        }
    }


    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'Invalid category ID' });
                return;
            }

            const updatedCategory = await categoryService.updateCategory(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Category updated successfully',
                data: updatedCategory
            });
        } catch (error) {
            next(error);
        }
    }


    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'Invalid category ID' });
                return;
            }

            const result = await categoryService.deleteCategory(id);
            res.status(200).json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}
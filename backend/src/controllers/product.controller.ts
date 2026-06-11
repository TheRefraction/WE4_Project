import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { CreateProductDTO, UpdateProductDTO } from '../models/product.model';

const productService = new ProductService();

export class ProductController {

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const products = await productService.getAllProductsWithDetails();
            res.status(200).json({ 
                success: true, 
                message: "Products retrieved successfully", 
                data: products });
        } catch (error: any) {
            
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) { res.status(400).json({ 
                success: false, 
                error: "Invalid product ID" }); return; }

            const product = await productService.getProductById(id);
            res.status(200).json({ 
                success: true, 
                data: product });
        } catch (error: any) {
            
            res.status(error.message === 'Product not found' ? 404 : 500).json({ 
                success: false, 
                error: error.message });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const dto: CreateProductDTO = req.body;
            const newProduct = await productService.createProduct(dto);
            res.status(201).json({ 
                success: true, 
                message: "Product created successfully", 
                data: newProduct });
        } catch (error: any) {
            
            res.status(error.message.includes('does not exist') ? 400 : 500).json({ 
                success: false, 
                error: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) { res.status(400).json({ success: false, error: "Invalid product ID" }); return; }

            const dto: UpdateProductDTO = req.body;
            const updatedProduct = await productService.updateProduct(id, dto);
            res.status(200).json({ 
                success: true,
                 message: "Product updated successfully", 
                 data: updatedProduct });
        } catch (error: any) {
           
            res.status(error.message.includes('does not exist') ? 400 : error.message === 'Product not found' ? 404 : 500).json({ success: false, error: error.message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) { res.status(400).json({ 
                success: false, 
                error: "Invalid product ID" }); return; }

            await productService.deleteProduct(id);
            res.status(200).json({ 
                success: true, 
                message: "Product deleted successfully" });
        } catch (error: any) {
            
            res.status(error.message === 'Product not found' ? 404 : 500).json({ 
                success: false, 
                error: error.message });
        }
    }
}
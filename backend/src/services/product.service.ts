import { ProductRepository } from '../repositories/product.repository';
import { ProductResponse, CreateProductDTO, UpdateProductDTO } from '../models/product.model';
import { AppError } from '../middlewares/error.middleware';

export class ProductService {
    constructor(private repo: ProductRepository) {}

    async getAll(showHidden = true): Promise<ProductResponse[]> {
        const products = await this.repo.findAll(showHidden);
        return Promise.all(products.map((prod) => this.mapToResponse(prod)));
    }

    async getById(id: number): Promise<ProductResponse> {
        const product = await this.repo.findById(id);
        if (!product) {
            throw new AppError('Product not found', 404);
        }

        return this.mapToResponse(product);
    }

    async create(dto: CreateProductDTO): Promise<ProductResponse> {
        if (dto.price < 0) throw new AppError('Invalid price', 400);

        const prod = await this.repo.create(dto);
        return this.mapToResponse(prod);
    }

    async update(id: number, dto: UpdateProductDTO): Promise<ProductResponse> {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new AppError('Product not found', 404);
        }

        if (dto.price && dto.price < 0) throw new AppError('Invalid price', 400);

        const prod = await this.repo.update(id, dto);
        if (!prod) throw new AppError('Failed to update product', 500);

        return this.mapToResponse(prod);
    }

    async delete(id: number): Promise<{success: boolean}> {
        const existingProduct = await this.repo.findById(id);
        if (!existingProduct) {
            throw new AppError('Product not found', 404);
        }

        const success = await this.repo.delete(id);
        return { success: success };
    }

    private async mapToResponse(data: any): Promise<ProductResponse> {
        return {
            id: data.id,
            name: data.name,
            description: data.description ?? null,
            price: data.price,
            supplierId: data.supplierId ?? null,
            hidden: data.hidden,
            customizations: data.customizations ?? [],
            categories: data.categories ?? [],
            supplier: data.supplier ?? null
        };
    }
}
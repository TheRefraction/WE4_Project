import { ProductRepository } from '../repositories/product.repository';
import { SupplierRepository } from '../repositories/supplier.repository';
import { CreateProductDTO, UpdateProductDTO, ProductResponse } from '../models/product.model';

export class ProductService {
    private productRepository: ProductRepository;
    private supplierRepository: SupplierRepository;

    constructor() {
        this.productRepository = new ProductRepository();
        this.supplierRepository = new SupplierRepository();
    }

    async getAllProducts(showHidden = true): Promise<ProductResponse[]> {
        return await this.productRepository.findAll(showHidden);
    }

    async getAllProductsWithDetails(): Promise<ProductResponse[]> {
        return await this.productRepository.findAllWithSupplierAndCategories();
    }

    async getProductById(id: number): Promise<ProductResponse> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async getProductsFiltered(search: string | null, sort: string | null): Promise<ProductResponse[]> {
        return await this.productRepository.findFiltered(search, sort);
    }

    async createProduct(dto: CreateProductDTO): Promise<ProductResponse> {
        const { categoryIds, ...productData } = dto;

        if (productData.supplier_id !== null) {
            const supplierExists = await this.supplierRepository.findById(productData.supplier_id);
            if (!supplierExists) {
                throw new Error(`Supplier with ID ${productData.supplier_id} does not exist`);
            }
        }

        return await this.productRepository.createWithCategories(productData, categoryIds);
    }

    async updateProduct(id: number, dto: UpdateProductDTO): Promise<ProductResponse | null> {
        const { categoryIds, ...productData } = dto;

        const existingProduct = await this.productRepository.findById(id);
        if (!existingProduct) {
            throw new Error('Product not found');
        }

        if (productData.supplier_id !== undefined && productData.supplier_id !== null) {
            const supplierExists = await this.supplierRepository.findById(productData.supplier_id);
            if (!supplierExists) {
                throw new Error(`Supplier with this ID does not exist`);
            }
        }

        return await this.productRepository.updateWithCategories(id, productData, categoryIds || []);
    }

    async deleteProduct(id: number): Promise<boolean> {
        const existingProduct = await this.productRepository.findById(id);
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        return await this.productRepository.delete(id);
    }
}
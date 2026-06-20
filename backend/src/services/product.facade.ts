import { ProductResponse } from "../models/product.model";
import { CategoryService } from "./category.service";
import { CustomizationFacade } from "./customization.facade";
import { ProductService } from "./product.service";
import { SupplierService } from "./supplier.service";

export class ProductFacade {
    constructor(private productSvc: ProductService, 
        private customizationFcd: CustomizationFacade, 
        private categorySvc: CategoryService, 
        private supplierSvc: SupplierService) {}

    async getFullProduct(productId: number): Promise<ProductResponse> {
        const productRaw: ProductResponse = await this.productSvc.getById(productId);

        const [customizations, categories, supplier] = await Promise.all([
            this.customizationFcd.getFullSlotsByProductId(productId),
            this.categorySvc.getAllByProductId(productId),
            productRaw.supplierId 
            ? this.supplierSvc.getById(productRaw.supplierId) 
            : Promise.resolve(null)
        ]);

        let fullProduct: ProductResponse = {
            ...productRaw,
            customizations,
            categories
        };

        if (supplier) {
            fullProduct = {
                ...fullProduct,
                supplier
            };
        }

        return fullProduct;
    }

    async getAllFullProducts(): Promise<ProductResponse[]> {
        const products = await this.productSvc.getAll();
        return Promise.all(products.map(prod => this.getFullProduct(prod.id)));
    }
}
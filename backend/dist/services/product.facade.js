"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFacade = void 0;
class ProductFacade {
    productSvc;
    customizationFcd;
    categorySvc;
    supplierSvc;
    constructor(productSvc, customizationFcd, categorySvc, supplierSvc) {
        this.productSvc = productSvc;
        this.customizationFcd = customizationFcd;
        this.categorySvc = categorySvc;
        this.supplierSvc = supplierSvc;
    }
    async getFullProduct(productId) {
        const productRaw = await this.productSvc.getById(productId);
        const [customizations, categories, supplier] = await Promise.all([
            this.customizationFcd.getFullSlotsByProductId(productId),
            this.categorySvc.getAllByProductId(productId),
            productRaw.supplierId
                ? this.supplierSvc.getById(productRaw.supplierId)
                : Promise.resolve(null)
        ]);
        let fullProduct = {
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
    async getAllFullProducts() {
        const products = await this.productSvc.getAll();
        return Promise.all(products.map(prod => this.getFullProduct(prod.id)));
    }
}
exports.ProductFacade = ProductFacade;

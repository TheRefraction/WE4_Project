"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const base_controller_1 = require("./base.controller");
class ProductController extends base_controller_1.BaseController {
    productSvc;
    productFcd;
    constructor(productSvc, productFcd) {
        super();
        this.productSvc = productSvc;
        this.productFcd = productFcd;
    }
    getAll = async (req, res, next) => {
        try {
            const products = await this.productFcd.getAllFullProducts();
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Products retrieved successfully', products);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const product = await this.productSvc.getById(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Product retrieved', product);
        }
        catch (error) {
            next(error);
        }
    };
    getFullProduct = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const product = await this.productFcd.getFullProduct(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Product retrieved', product);
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const result = await this.productSvc.create(req.body);
            this.sendResponse(res, 201 /* HttpStatus.CREATED */, 'Product created successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.productSvc.update(id, req.body);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Product updated successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.productSvc.delete(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Product deleted successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ProductController = ProductController;

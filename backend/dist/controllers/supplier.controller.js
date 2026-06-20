"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierController = void 0;
const base_controller_1 = require("./base.controller");
class SupplierController extends base_controller_1.BaseController {
    supplierSvc;
    constructor(supplierSvc) {
        super();
        this.supplierSvc = supplierSvc;
    }
    getAll = async (req, res, next) => {
        try {
            const result = await this.supplierSvc.getAll();
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Suppliers retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const sanId = parseInt(id);
            const result = await this.supplierSvc.getById(sanId);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Supplier retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const result = await this.supplierSvc.create(req.body);
            this.sendResponse(res, 201 /* HttpStatus.CREATED */, 'Supplier created successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const sanId = parseInt(id);
            const result = await this.supplierSvc.update(sanId, req.body);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Supplier updated successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const sanId = parseInt(id);
            await this.supplierSvc.delete(sanId);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Supplier deleted successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.SupplierController = SupplierController;

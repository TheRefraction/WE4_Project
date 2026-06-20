"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const base_controller_1 = require("./base.controller");
class CategoryController extends base_controller_1.BaseController {
    categorySvc;
    constructor(categorySvc) {
        super();
        this.categorySvc = categorySvc;
    }
    getAll = async (req, res, next) => {
        try {
            const categories = await this.categorySvc.getAll();
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Categories retrieved', categories);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const category = await this.categorySvc.getById(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Category retrieved', category);
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const newCategory = await this.categorySvc.create(req.body);
            this.sendResponse(res, 201 /* HttpStatus.CREATED */, 'Category created successfully', newCategory);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const updatedCategory = await this.categorySvc.update(id, req.body);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Category updated', updatedCategory);
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.categorySvc.delete(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Category deleted successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CategoryController = CategoryController;

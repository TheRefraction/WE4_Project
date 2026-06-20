"use strict";
/**
 * menu.controller.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
const base_controller_1 = require("./base.controller");
class MenuController extends base_controller_1.BaseController {
    menuSvc;
    constructor(menuSvc) {
        super();
        this.menuSvc = menuSvc;
    }
    getAll = async (req, res, next) => {
        try {
            const showHidden = req.query.showHidden !== 'false';
            const menus = await this.menuSvc.getAll(showHidden);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Menus retrieved successfully', menus);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const menu = await this.menuSvc.getById(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Menu retrieved successfully', menu);
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const menu = await this.menuSvc.create(req.body);
            this.sendResponse(res, 201 /* HttpStatus.CREATED */, 'Menu created successfully', menu);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const menu = await this.menuSvc.update(id, req.body);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Menu updated successfully', menu);
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.menuSvc.delete(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Menu deleted successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.MenuController = MenuController;

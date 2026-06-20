"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionController = void 0;
const base_controller_1 = require("./base.controller");
class OptionController extends base_controller_1.BaseController {
    optSvc;
    slotFcd;
    constructor(optSvc, slotFcd) {
        super();
        this.optSvc = optSvc;
        this.slotFcd = slotFcd;
    }
    getAllBySlotId = async (req, res, next) => {
        try {
            const slotId = parseInt(req.params.id);
            const opt = await this.optSvc.getAllBySlotId(slotId);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Option retrieved', opt);
        }
        catch (error) {
            next(error);
        }
    };
    getBySlotAndProduct = async (req, res, next) => {
        try {
            const slotId = parseInt(req.params.id);
            const opt = await this.optSvc.getBySlotAndProduct(slotId, req.body.productId);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Option retrieved', opt);
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const result = await this.slotFcd.addOptionToSlot(req.body);
            this.sendResponse(res, 201 /* HttpStatus.CREATED */, 'Option added successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const slotId = parseInt(req.params.id);
            const result = await this.optSvc.update(slotId, req.body);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Option updated successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const slotId = parseInt(req.params.id);
            await this.slotFcd.removeOptionFromSlot(slotId, req.body.productId);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Option removed successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.OptionController = OptionController;

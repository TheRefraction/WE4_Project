"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomizationController = void 0;
const base_controller_1 = require("./base.controller");
class CustomizationController extends base_controller_1.BaseController {
    slotSvc;
    slotFcd;
    constructor(slotSvc, slotFcd) {
        super();
        this.slotSvc = slotSvc;
        this.slotFcd = slotFcd;
    }
    getAll = async (req, res, next) => {
        try {
            const slots = await this.slotSvc.getAll();
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Slots retrieved', slots);
        }
        catch (error) {
            next(error);
        }
    };
    getAllByProductId = async (req, res, next) => {
        try {
            const productId = parseInt(req.params.id);
            const slots = await this.slotSvc.getAllByProductId(productId);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Slots retrieved', slots);
        }
        catch (error) {
            next(error);
        }
    };
    getFullSlotsByProductId = async (req, res, next) => {
        try {
            const productId = parseInt(req.params.id);
            const slots = await this.slotFcd.getFullSlotsByProductId(productId);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Slots retrieved', slots);
        }
        catch (error) {
            next(error);
        }
    };
    getbyId = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const slot = await this.slotSvc.getById(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Slot retrieved', slot);
        }
        catch (error) {
            next(error);
        }
    };
    getFullSlotById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const slot = await this.slotFcd.getFullSlotById(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Full slot retrieved', slot);
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const slot = await this.slotSvc.create(req.body);
            this.sendResponse(res, 201 /* HttpStatus.CREATED */, 'Slot created succesfully', slot);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const slot = await this.slotSvc.update(id, req.body);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Slot updated succesfully', slot);
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.slotSvc.delete(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Slot deleted succesfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CustomizationController = CustomizationController;

"use strict";
/**
 * account.controller.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const base_controller_1 = require("./base.controller");
const account_model_1 = require("../models/account.model");
class AccountController extends base_controller_1.BaseController {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    register = async (req, res, next) => {
        try {
            const result = await this.service.register(req.body);
            this.sendResponse(res, 201 /* HttpStatus.CREATED */, 'Account created succesfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.service.login(email, password);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Login successful', result);
        }
        catch (error) {
            next(error);
        }
    };
    getProfile = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const result = await this.service.getById(userId);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Account retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    getAccountById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.getById(id);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Account retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    getAllAccounts = async (req, res, next) => {
        try {
            if (req.user.role !== account_model_1.Role.Admin) {
                this.sendResponse(res, 403 /* HttpStatus.FORBIDDEN */, 'Permission denied');
                return;
            }
            const { role } = req.query;
            if (role !== undefined) {
                if (typeof role !== 'string' || !Object.values(account_model_1.Role).includes(role)) {
                    this.sendResponse(res, 400 /* HttpStatus.BAD_REQUEST */, 'Invalid role filter');
                    return;
                }
            }
            const result = await this.service.getAll(role);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Accounts retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    updateAccount = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401 /* HttpStatus.UNAUTHORIZED */).json({ message: 'User not authenticated' });
                return;
            }
            const result = await this.service.update(id, req.body, userId);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Account updated successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    deleteAccount = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401 /* HttpStatus.UNAUTHORIZED */).json({ message: 'User not authenticated' });
                return;
            }
            await this.service.delete(id, userId);
            this.sendResponse(res, 200 /* HttpStatus.OK */, 'Account deleted successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AccountController = AccountController;

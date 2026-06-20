/**
 * account.controller.ts
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { Role } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { HttpStatus } from '../utils/httpStatus';

export class AccountController extends BaseController {
    constructor(private service: AccountService) { super(); }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.service.register(req.body);

            this.sendResponse(res, HttpStatus.CREATED, 'Account created succesfully', result);
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            const result = await this.service.login(email, password);

            this.sendResponse(res, HttpStatus.OK, 'Login successful', result);
        } catch (error) {
            next(error);
        }
    }

    getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;

            const result = await this.service.getById(userId);

            this.sendResponse(res, HttpStatus.OK, 'Account retrieved successfully', result);
        } catch (error) {
            next(error);
        }
    }

    getAccountById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            const result = await this.service.getById(id);

            this.sendResponse(res, HttpStatus.OK, 'Account retrieved successfully', result);
        } catch (error) {
            next(error);
        }
    }

    getAllAccounts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.user!.role !== Role.Admin) {
                this.sendResponse(res, HttpStatus.FORBIDDEN, 'Permission denied');
                return;
            }

            const { role } = req.query;

            if (role !== undefined) {
                if (typeof role !== 'string' || !Object.values(Role).includes(role as Role)) {
                    this.sendResponse(res, HttpStatus.BAD_REQUEST, 'Invalid role filter');
                    return;
                }
            }

            const result = await this.service.getAll(role as Role | undefined);

            this.sendResponse(res, HttpStatus.OK, 'Accounts retrieved successfully', result);
        } catch (error) {
            next(error);
        }
    }

    updateAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user?.userId;

            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
                return;
            }

            const result = await this.service.update(id, req.body, userId);

            this.sendResponse(res, HttpStatus.OK, 'Account updated successfully', result);
        } catch (error) {
            next(error);
        }
    }

    deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user?.userId;

            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: 'User not authenticated' });
                return;
            }

            await this.service.delete(id, userId);

            this.sendResponse(res, HttpStatus.OK, 'Account deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}
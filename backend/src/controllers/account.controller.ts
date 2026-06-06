/**
 * account.controller.ts
 * 
 * This file defines the AccountController class, which handles HTTP requests related to user accounts.
 * It uses the AccountService to perform business logic and interacts with the AccountRepository for database operations.
 * The controller provides endpoints for creating accounts, logging in, updating account information, and retrieving account details.
 * It also includes error handling to ensure that appropriate responses are sent back to the client in case of any issues.
 */

import { Request, Response, NextFunction } from 'express';
import { AccountService } from '../services/account.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const accountService = new AccountService();

export class AccountController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await accountService.register(req.body);

            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const result = await accountService.login(email, password);

            res.json({ 
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;

            const result = await accountService.getAccountById(userId);

            res.json({ 
                success: true,
                message: 'Account retrieved successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getAccountById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const result = await accountService.getAccountById(parseInt(id));

            res.json({ 
                success: true,
                message: 'Account retrieved successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllAccounts(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (req.user!.roleId !== 3) {
                res.status(403).json({
                    success: false,
                    message: 'Permission denied'
                });
                return;
            }

            const { role } = req.query;
            let result;

            if (role) {
                result = await accountService.getAllAccounts(role as number);
            } else {
                result = await accountService.getAllAccounts();
            }

            res.json({ 
                success: true,
                message: 'Accounts retrieved successfully',
                data: result,
                count: result.length
            });
        } catch (error) {
            next(error);
        }
    }

    async updateAccount(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            const result = await accountService.updateAccount(parseInt(id), req.body, userId);

            res.json({ 
                success: true,
                message: 'Account updated successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            await accountService.deleteAccount(parseInt(id), userId);

            res.status(204).json({
                success: true,
                message: 'Account deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}
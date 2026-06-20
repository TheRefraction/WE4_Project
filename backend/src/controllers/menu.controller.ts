/**
 * menu.controller.ts
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/menu.service';
import { BaseController } from './base.controller';
import { HttpStatus } from '../utils/httpStatus';

export class MenuController extends BaseController {
    constructor(private menuSvc: MenuService) {
        super();
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const showHidden = req.query.showHidden !== 'false';
            const menus = await this.menuSvc.getAll(showHidden);
            this.sendResponse(res, HttpStatus.OK, 'Menus retrieved successfully', menus);
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const menu = await this.menuSvc.getById(id);
            this.sendResponse(res, HttpStatus.OK, 'Menu retrieved successfully', menu);
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const menu = await this.menuSvc.create(req.body);
            this.sendResponse(res, HttpStatus.CREATED, 'Menu created successfully', menu);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const menu = await this.menuSvc.update(id, req.body);
            this.sendResponse(res, HttpStatus.OK, 'Menu updated successfully', menu);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            await this.menuSvc.delete(id);
            this.sendResponse(res, HttpStatus.OK, 'Menu deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

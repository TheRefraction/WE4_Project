import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../utils/httpStatus';

export abstract class BaseController {
    protected sendResponse<T>(res: Response, status: HttpStatus = HttpStatus.OK, message: string = "OK", data: T | null = null) {
        const response: any = {
            success: status < HttpStatus.BAD_REQUEST,
            message,
            data
        };

        if (Array.isArray(data)) {
            response.count = data.length;
        }

        res.status(status).json(response);
    }
}
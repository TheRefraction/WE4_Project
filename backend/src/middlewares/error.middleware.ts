import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { HttpStatus } from '../utils/httpStatus';

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorMiddleware = (
    error: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const statusCode = error instanceof AppError ? error.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';

    if (statusCode >= 500) {
        console.error('Error:', error);
    } else {
        console.warn('Error:', message);
    }

    // Send back response to client
    res.status(statusCode).json({
        success: false,
        message,
        stack: env.NODE_ENV === 'development' ? error.stack : undefined
    });
};
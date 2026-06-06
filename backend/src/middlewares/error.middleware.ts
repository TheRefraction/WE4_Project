import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error.message || 'Internal Server Error';
  
  console.error('Error:', error);
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};
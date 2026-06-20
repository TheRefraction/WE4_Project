"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.AppError = void 0;
const env_1 = require("../config/env");
class AppError extends Error {
    statusCode;
    constructor(message, statusCode = 500 /* HttpStatus.INTERNAL_SERVER_ERROR */) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorMiddleware = (error, req, res, _next) => {
    const statusCode = error instanceof AppError ? error.statusCode : 500 /* HttpStatus.INTERNAL_SERVER_ERROR */;
    const message = error.message || 'Internal Server Error';
    if (statusCode >= 500) {
        console.error('Error:', error);
    }
    else {
        console.warn('Error:', message);
    }
    // Send back response to client
    res.status(statusCode).json({
        success: false,
        message,
        stack: env_1.env.NODE_ENV === 'development' ? error.stack : undefined
    });
};
exports.errorMiddleware = errorMiddleware;

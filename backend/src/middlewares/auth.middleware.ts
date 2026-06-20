import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../models/account.model';
import { HttpStatus } from '../utils/httpStatus';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        role: Role;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as {
            userId: number;
            email: string;
            role: Role;
        };

        req.user = decoded;
        next();
    } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Invalid or expired token' });
    }
};


export const adminMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== Role.Admin) {
        res.status(HttpStatus.FORBIDDEN).json({ success: false, message: 'Admin access required' });
        return;
    }
    next();
};
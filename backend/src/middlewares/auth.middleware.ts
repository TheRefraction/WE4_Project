import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../models/account.model';

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
      res.status(401).json({ success: false, message: 'Authentication required' });
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
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};


export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== Role.Admin) {
    res.status(403).json({ success: false, message: 'Admin access required' });
    return;
  }
  next();
};
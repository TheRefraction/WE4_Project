import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { HttpStatus } from '../utils/httpStatus';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, errors: errors.array() });
        return;
    }
    
    next();
};

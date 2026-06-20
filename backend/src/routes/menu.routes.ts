/**
 * menu.routes.ts
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { menuController } from '../container';

const router = Router();

const idValidation = [param('id').isInt().withMessage('Invalid ID')];

const menuValidation = {
    CREATE: [
        body('name').notEmpty().withMessage('Menu name is required').isLength({ max: 128 }).withMessage('Name cannot exceed 128 characters'),
        body('description').optional(),
        body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('hidden').optional().isBoolean().withMessage('hidden must be a boolean'),
        body('productIds').optional().isArray().withMessage('productIds must be an array')
    ],
    UPDATE: [
        body('name').optional().isLength({ max: 128 }).withMessage('Name cannot exceed 128 characters'),
        body('description').optional(),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('hidden').optional().isBoolean().withMessage('hidden must be a boolean'),
        body('productIds').optional().isArray().withMessage('productIds must be an array')
    ]
};

// Public routes
router.get('/', menuController.getAll);
router.get('/:id', idValidation, validateRequest, menuController.getById);

// Protected routes
router.use(authMiddleware);
router.post('/', menuValidation.CREATE, validateRequest, menuController.create);
router.put('/:id', idValidation, menuValidation.UPDATE, validateRequest, menuController.update);
router.delete('/:id', idValidation, menuController.delete);

export default router;

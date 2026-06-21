import { Router } from 'express';
import { body, param } from 'express-validator';

import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';

import { categoryController } from '../container';

const router = Router();

const idValidation = [param('id').isInt().withMessage('Invalid ID')];

const categoryValidation = {
    CREATE: [
        body('name').notEmpty().withMessage('Category name is required').isLength({ max: 128 }).withMessage('Category name cannot exceed 128 characters')
    ],
    UPDATE: [
        body('name').optional().isLength({ max: 128 }).withMessage('Category name cannot exceed 128 characters')
    ]
};

// Public
router.get('/', categoryController.getAll);
router.get('/:id', idValidation, validateRequest, categoryController.getById);

// Protected
router.use(authMiddleware);
router.post('/', categoryValidation.CREATE, validateRequest, categoryController.create);
router.put('/:id', idValidation, categoryValidation.UPDATE, validateRequest, categoryController.update);
router.delete('/:id', idValidation, validateRequest, categoryController.delete);

export default router;
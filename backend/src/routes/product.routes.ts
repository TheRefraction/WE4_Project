import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { adminMiddleware, authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';

import { productController } from '../container';

const router = Router();

const idValidation = [param('id').isInt().withMessage('Invalid ID')];
const showHiddenValidation = [query('showHidden').optional().isBoolean().withMessage('showHidden should be a boolean')];

//.custom((value) => value === null || typeof value === 'number').withMessage('Supplier ID must be a number or null')
const productValidation = {
    CREATE: [
        body('name').notEmpty().withMessage('Product name is required').isLength({ max: 128 }).withMessage('Name cannot exceed 128 characters'),
        body('description').optional(),
        body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('supplierId').optional().isInt().withMessage('supplierId must be a number'),
        body('hidden').notEmpty().withMessage('hidden is required').isBoolean().withMessage('hidden must be a boolean')
    ],
    UPDATE: [
        body('name').optional().isLength({ max: 128 }).withMessage('Name cannot exceed 128 characters'),
        body('description').optional(),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('supplierId').optional().isInt().withMessage('supplierId must be a number'),
        body('hidden').optional().isBoolean().withMessage('hidden must be a boolean')
    ]
};

// Public routes
router.get('/', showHiddenValidation, validateRequest, productController.getAll);
router.get('/:id', idValidation, validateRequest, productController.getById);
router.get('/:id/detail', idValidation, validateRequest, productController.getFullProduct);

// Protected routes
router.use(authMiddleware);
router.post('/', adminMiddleware, productValidation.CREATE, validateRequest, productController.create);
router.put('/:id', adminMiddleware, idValidation, productValidation.UPDATE, validateRequest, productController.update);
router.delete('/:id', adminMiddleware, idValidation, productController.delete);

export default router;
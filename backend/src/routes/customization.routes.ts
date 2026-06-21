import { Router } from 'express';
import { body, param } from 'express-validator';

import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';

import { customizationController, optionController } from '../container';

const router = Router()

const idValidation = [param('id').isInt().withMessage('Invalid ID')];

const slotValidation = {
    CREATE: [
        body('productId').notEmpty().withMessage('Requires Product ID').isInt().withMessage('Invalid Product ID'),
        body('categoryId').notEmpty().withMessage('Requires Category ID').isInt().withMessage('Invalid Category ID'),
        body('minSelect').notEmpty().withMessage('Requires minSelect').isInt({ min: 0 }).withMessage('minSelect must be >= 0'),
        body('maxSelect').notEmpty().withMessage('Requires maxSelect').isInt({ min: 0 }).withMessage('maxSelect must be >= 0'),
        body('displayOrder').notEmpty().withMessage('Requires DisplayOrder').isInt({ min: 0 }).withMessage('displayOrder must be >= 0')
    ],
    UPDATE: [
        body('productId').optional().isInt().withMessage('Invalid Product ID'),
        body('categoryId').optional().isInt().withMessage('Invalid Category ID'),
        body('minSelect').optional().isInt({ min: 0 }).withMessage('minSelect must be >= 0'),
        body('maxSelect').optional().isInt({ min: 0 }).withMessage('maxSelect must be >= 0'),
        body('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be >= 0')
    ]
};

const optionValidation = { 
    CREATE: [
        body('productId').notEmpty().isInt().withMessage('Option Product ID must be an integer'),
        body('priceDelta').notEmpty().isFloat().withMessage('priceDelta must be a number'),
        body('isDefault').notEmpty().isBoolean().withMessage('isDefault must be a boolean'),
        body('displayOrder').notEmpty().isInt({ min: 0 }).withMessage('displayOrder must be >= 0')
    ],
    UPDATE: [
        body('productId').notEmpty().isInt().withMessage('Option Product ID must be an integer'),
        body('priceDelta').optional().isFloat().withMessage('priceDelta must be a number'),
        body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean'),
        body('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be >= 0')
    ]
};

// Public
router.get('/', customizationController.getAll);
router.get('/product/:id', idValidation, validateRequest, customizationController.getAllByProductId);
router.get('/product/:id/detail', idValidation, validateRequest, customizationController.getFullSlotsByProductId);

// Protected
router.use(authMiddleware);
router.post('/', slotValidation.CREATE, validateRequest, customizationController.create);
router.put('/:id', idValidation, slotValidation.UPDATE, validateRequest, customizationController.update);
router.delete('/:id', idValidation, validateRequest, customizationController.delete);
// Options (admin)
router.post('/:id/options', idValidation, optionValidation.CREATE, validateRequest, optionController.create);
router.put('/:id/options', idValidation, optionValidation.UPDATE, validateRequest, optionController.update);
router.delete('/:id/options', idValidation, validateRequest, optionController.delete);

export default router;
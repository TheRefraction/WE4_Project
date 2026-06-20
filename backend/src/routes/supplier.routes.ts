import { Router } from 'express';
import { body, param } from 'express-validator';

import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';

import { supplierController } from '../container';

const router = Router();

const idValidation = [param('id').isInt().withMessage('Invalid ID')];

const supplierValidation = {
    CREATE: [
        body('name').notEmpty().withMessage('Supplier name is required').isLength({ max: 255 }).withMessage('Name cannot exceed 255 characters'),
        body('contactInfo.email').isEmail().withMessage('A valid email is required'),
        body('contactInfo.phone').notEmpty().withMessage('Phone number is required').isMobilePhone('any').withMessage('A valid phone number is required')
    ],
    UPDATE: [
        body('name').notEmpty().withMessage('Supplier name is required').isLength({ max: 255 }).withMessage('Name cannot exceed 255 characters'),
        body('contactInfo.email').isEmail().withMessage('A valid email is required'),
        body('contactInfo.phone').notEmpty().withMessage('Phone number is required').isMobilePhone('any').withMessage('A valid phone number is required')
    ]
};

// Public
router.get('/', supplierController.getAll);
router.get('/:id', idValidation, validateRequest, supplierController.getById);

// Protected
router.use(authMiddleware);
router.post('/', supplierValidation.CREATE, validateRequest, supplierController.create);
router.put('/:id', idValidation, supplierValidation.UPDATE, validateRequest, supplierController.update);
router.delete('/:id', idValidation, validateRequest, supplierController.delete);

export default router;
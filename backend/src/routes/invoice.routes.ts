import { Router } from 'express';
import { body, param } from 'express-validator';

import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';

import { invoiceController } from '../container';

const router = Router();

const idValidation = [param('id').isInt().withMessage('Invalid ID')];

const invoiceValidation = {
    CREATE: [
        body('accountId').notEmpty().withMessage('Account ID required').isInt().withMessage('customerId must be integer'),
        body('amount').isFloat({ min: 0 }).withMessage('amount must be > 0'),
        body('billingAddress').notEmpty().withMessage('billingAddress is required'),
        body('billingAddress.street').notEmpty().withMessage('street is required'),
        body('billingAddress.city').notEmpty().withMessage('city is required'),
        body('billingAddress.zip').notEmpty().withMessage('zip is required'),
        body('billingAddress.country').notEmpty().withMessage('country is required'),
        body('items').notEmpty().withMessage('Items is required').isArray({ min: 1 }).withMessage('items must contain at least one product/menu')
    ],
    UPDATE: [
        body('amount').optional().isFloat({ min: 0 }).withMessage('amount must be > 0'),
        body('billingAddress').optional(),
        body('billingAddress.street').optional(),
        body('billingAddress.city').optional(),
        body('billingAddress.zip').optional(),
        body('billingAddress.country').optional(),
        body('items').optional().isArray({ min: 1 }).withMessage('items must contain at least one product/menu')
    ]
};

router.use(authMiddleware);
router.get('/:id', idValidation, validateRequest, invoiceController.getById);
router.post('/', invoiceValidation.CREATE, validateRequest, invoiceController.create);
router.put('/:id', idValidation, invoiceValidation.UPDATE, validateRequest, invoiceController.update);
router.delete('/:id', idValidation, validateRequest, invoiceController.delete);

export default router;
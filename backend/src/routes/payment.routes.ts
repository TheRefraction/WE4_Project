import { Router } from 'express';
import { body, param } from 'express-validator';

import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { PaymentMode, PaymentStatus } from '../models/payment.model';

import { paymentController } from '../container';

const router = Router();

const idValidation = [param('id').isInt().withMessage('Invalid ID')];

const paymentValidation = {
    CREATE: [
        body('mode').notEmpty().withMessage('Payment mode required').isIn(Object.values(PaymentMode)).withMessage(`Status must be one of: ${Object.values(PaymentMode).join(', ')}`),
        body('status').optional().isIn(Object.values(PaymentStatus)).withMessage(`Status must be one of: ${Object.values(PaymentStatus).join(', ')}`),
        body('paymentDate').optional().isDate().withMessage('Must be a date')
    ],
    UPDATE: [
        body('mode').optional().isIn(Object.values(PaymentMode)).withMessage(`Status must be one of: ${Object.values(PaymentMode).join(', ')}`),
        body('status').optional().isIn(Object.values(PaymentStatus)).withMessage(`Status must be one of: ${Object.values(PaymentStatus).join(', ')}`),
        body('paymentDate').optional().isDate().withMessage('Must be a date')
    ]
};

router.use(authMiddleware);
router.get('/', paymentController.getAll);
router.get('/:id', idValidation, validateRequest, paymentController.getById);
router.post('/', paymentValidation.CREATE, validateRequest, paymentController.create);
router.put('/:id', idValidation, paymentValidation.UPDATE, validateRequest, paymentController.update);

export default router;
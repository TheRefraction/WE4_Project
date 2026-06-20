import { Router } from 'express';
import { body } from 'express-validator';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { PaymentStatus } from '../models/payment.model';

const router = Router();
const paymentController = new PaymentController();

const createPaymentValidation = [
    body('status')
        .optional()
        .isIn(Object.values(PaymentStatus))
        .withMessage(`Status must be one of: ${Object.values(PaymentStatus).join(', ')}`)
];

router.post('/', authMiddleware, createPaymentValidation, validateRequest, paymentController.create);

export default router;
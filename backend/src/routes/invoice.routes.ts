import { Router } from 'express';
import { body, param } from 'express-validator';
import { InvoiceController } from '../controllers/invoice.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';

const router = Router();
const invoiceController = new InvoiceController();

const createInvoiceValidation = [
    body('customerId').isInt().withMessage('customerId must be integer'),
    body('amount').isFloat({ min: 0 }).withMessage('amount must be > 0'),
    body('billingAddress').notEmpty().withMessage('billingAddress is required'),
    body('billingAddress.street').notEmpty().withMessage('street is required'),
    body('billingAddress.city').notEmpty().withMessage('city is required'),
    body('billingAddress.zip').notEmpty().withMessage('zip is required'),
    body('billingAddress.country').notEmpty().withMessage('country is required'),
    body('items').isArray({ min: 1 }).withMessage('items must contain at least one product/menu/')
];

const getInvoiceValidation = [
    param('id').isInt().withMessage('Invoice ID in URL must be an integer')
];

router.use(authMiddleware);

// create facture
router.post('/', createInvoiceValidation, validateRequest, invoiceController.create);

// get facture details
router.get('/:id', getInvoiceValidation, validateRequest, invoiceController.getById);

export default router;
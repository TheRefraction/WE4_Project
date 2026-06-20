"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const invoice_controller_1 = require("../controllers/invoice.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
const invoiceController = new invoice_controller_1.InvoiceController();
const createInvoiceValidation = [
    (0, express_validator_1.body)('customerId').isInt().withMessage('customerId must be integer'),
    (0, express_validator_1.body)('amount').isFloat({ min: 0 }).withMessage('amount must be > 0'),
    (0, express_validator_1.body)('billingAddress').notEmpty().withMessage('billingAddress is required'),
    (0, express_validator_1.body)('billingAddress.street').notEmpty().withMessage('street is required'),
    (0, express_validator_1.body)('billingAddress.city').notEmpty().withMessage('city is required'),
    (0, express_validator_1.body)('billingAddress.zip').notEmpty().withMessage('zip is required'),
    (0, express_validator_1.body)('billingAddress.country').notEmpty().withMessage('country is required'),
    (0, express_validator_1.body)('items').isArray({ min: 1 }).withMessage('items must contain at least one product/menu/')
];
const getInvoiceValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage('Invoice ID in URL must be an integer')
];
router.use(auth_middleware_1.authMiddleware);
// create facture
router.post('/', createInvoiceValidation, validation_middleware_1.validateRequest, invoiceController.create);
// get all factures
router.get('/', invoiceController.getAll);
// get facture details
router.get('/:id', getInvoiceValidation, validation_middleware_1.validateRequest, invoiceController.getById);
// update status
router.patch('/:id/status', [
    (0, express_validator_1.param)('id').isInt().withMessage('Invoice ID in URL must be an integer'),
    (0, express_validator_1.body)('status').notEmpty().withMessage('status is required')
], validation_middleware_1.validateRequest, invoiceController.updateStatus);
exports.default = router;

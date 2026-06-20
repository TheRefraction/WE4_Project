"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const container_1 = require("../container");
const router = (0, express_1.Router)();
const idValidation = [(0, express_validator_1.param)('id').isInt().withMessage('Invalid ID')];
//.custom((value) => value === null || typeof value === 'number').withMessage('Supplier ID must be a number or null')
const productValidation = {
    CREATE: [
        (0, express_validator_1.body)('name').notEmpty().withMessage('Product name is required').isLength({ max: 128 }).withMessage('Name cannot exceed 128 characters'),
        (0, express_validator_1.body)('description').optional(),
        (0, express_validator_1.body)('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        (0, express_validator_1.body)('supplierId').optional().isInt().withMessage('supplierId must be a number'),
        (0, express_validator_1.body)('hidden').notEmpty().withMessage('hidden is required').isBoolean().withMessage('hidden must be a boolean')
    ],
    UPDATE: [
        (0, express_validator_1.body)('name').optional().isLength({ max: 128 }).withMessage('Name cannot exceed 128 characters'),
        (0, express_validator_1.body)('description').optional(),
        (0, express_validator_1.body)('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        (0, express_validator_1.body)('supplierId').optional().isInt().withMessage('supplierId must be a number'),
        (0, express_validator_1.body)('hidden').optional().isBoolean().withMessage('hidden must be a boolean')
    ]
};
// Public routes
router.get('/', container_1.productController.getAll);
router.get('/:id', idValidation, validation_middleware_1.validateRequest, container_1.productController.getById);
router.get('/:id/full', idValidation, validation_middleware_1.validateRequest, container_1.productController.getFullProduct);
// Protected routes
router.use(auth_middleware_1.authMiddleware);
router.post('/', productValidation.CREATE, validation_middleware_1.validateRequest, container_1.productController.create);
router.put('/:id', idValidation, productValidation.UPDATE, validation_middleware_1.validateRequest, container_1.productController.update);
router.delete('/:id', idValidation, container_1.productController.delete);
exports.default = router;

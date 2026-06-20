"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const container_1 = require("../container");
const router = (0, express_1.Router)();
const idValidation = [(0, express_validator_1.param)('id').isInt().withMessage('Invalid ID')];
const slotValidation = {
    CREATE: [
        (0, express_validator_1.body)('productId').notEmpty().withMessage('Requires Product ID').isInt().withMessage('Invalid Product ID'),
        (0, express_validator_1.body)('categoryId').notEmpty().withMessage('Requires Category ID').isInt().withMessage('Invalid Category ID'),
        (0, express_validator_1.body)('minSelect').notEmpty().withMessage('Requires minSelect').isInt({ min: 0 }).withMessage('minSelect must be >= 0'),
        (0, express_validator_1.body)('maxSelect').notEmpty().withMessage('Requires maxSelect').isInt({ min: 0 }).withMessage('maxSelect must be >= 0'),
        (0, express_validator_1.body)('displayOrder').notEmpty().withMessage('Requires DisplayOrder').isInt({ min: 0 }).withMessage('displayOrder must be >= 0')
    ],
    UPDATE: [
        (0, express_validator_1.body)('productId').optional().isInt().withMessage('Invalid Product ID'),
        (0, express_validator_1.body)('categoryId').optional().isInt().withMessage('Invalid Category ID'),
        (0, express_validator_1.body)('minSelect').optional().isInt({ min: 0 }).withMessage('minSelect must be >= 0'),
        (0, express_validator_1.body)('maxSelect').optional().isInt({ min: 0 }).withMessage('maxSelect must be >= 0'),
        (0, express_validator_1.body)('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be >= 0')
    ]
};
const optionValidation = {
    CREATE: [
        (0, express_validator_1.body)('productId').notEmpty().isInt().withMessage('Option Product ID must be an integer'),
        (0, express_validator_1.body)('priceDelta').notEmpty().isFloat().withMessage('priceDelta must be a number'),
        (0, express_validator_1.body)('isDefault').notEmpty().isBoolean().withMessage('isDefault must be a boolean'),
        (0, express_validator_1.body)('displayOrder').notEmpty().isInt({ min: 0 }).withMessage('displayOrder must be >= 0')
    ],
    UPDATE: [
        (0, express_validator_1.body)('productId').notEmpty().isInt().withMessage('Option Product ID must be an integer'),
        (0, express_validator_1.body)('priceDelta').optional().isFloat().withMessage('priceDelta must be a number'),
        (0, express_validator_1.body)('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean'),
        (0, express_validator_1.body)('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be >= 0')
    ]
};
// Public
router.get('/slots', container_1.customizationController.getAll);
router.get('/slots/product/:id', idValidation, validation_middleware_1.validateRequest, container_1.customizationController.getAllByProductId);
router.get('/slots/product/:id/detail', idValidation, validation_middleware_1.validateRequest, container_1.customizationController.getFullSlotsByProductId);
// Protected
router.use(auth_middleware_1.authMiddleware);
router.post('/slots', slotValidation.CREATE, validation_middleware_1.validateRequest, container_1.customizationController.create);
router.put('/slots/:id', idValidation, slotValidation.UPDATE, validation_middleware_1.validateRequest, container_1.customizationController.update);
router.delete('/slots/:id', idValidation, validation_middleware_1.validateRequest, container_1.customizationController.delete);
// Options (admin)
router.post('/slots/:id/options', idValidation, optionValidation.CREATE, validation_middleware_1.validateRequest, container_1.optionController.create);
router.put('/slots/:id/options', idValidation, optionValidation.UPDATE, validation_middleware_1.validateRequest, container_1.optionController.update);
router.delete('/slots/:id/options', idValidation, validation_middleware_1.validateRequest, container_1.optionController.delete);
exports.default = router;

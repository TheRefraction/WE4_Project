"use strict";
/**
 * menu.routes.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const container_1 = require("../container");
const router = (0, express_1.Router)();
const idValidation = [(0, express_validator_1.param)('id').isInt().withMessage('Invalid ID')];
const menuValidation = {
    CREATE: [
        (0, express_validator_1.body)('name').notEmpty().withMessage('Menu name is required').isLength({ max: 128 }).withMessage('Name cannot exceed 128 characters'),
        (0, express_validator_1.body)('description').optional(),
        (0, express_validator_1.body)('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        (0, express_validator_1.body)('hidden').optional().isBoolean().withMessage('hidden must be a boolean'),
        (0, express_validator_1.body)('productIds').optional().isArray().withMessage('productIds must be an array')
    ],
    UPDATE: [
        (0, express_validator_1.body)('name').optional().isLength({ max: 128 }).withMessage('Name cannot exceed 128 characters'),
        (0, express_validator_1.body)('description').optional(),
        (0, express_validator_1.body)('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        (0, express_validator_1.body)('hidden').optional().isBoolean().withMessage('hidden must be a boolean'),
        (0, express_validator_1.body)('productIds').optional().isArray().withMessage('productIds must be an array')
    ]
};
// Public routes
router.get('/', container_1.menuController.getAll);
router.get('/:id', idValidation, validation_middleware_1.validateRequest, container_1.menuController.getById);
// Protected routes
router.use(auth_middleware_1.authMiddleware);
router.post('/', menuValidation.CREATE, validation_middleware_1.validateRequest, container_1.menuController.create);
router.put('/:id', idValidation, menuValidation.UPDATE, validation_middleware_1.validateRequest, container_1.menuController.update);
router.delete('/:id', idValidation, container_1.menuController.delete);
exports.default = router;

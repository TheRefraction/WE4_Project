"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const container_1 = require("../container");
const router = (0, express_1.Router)();
const idValidation = [(0, express_validator_1.param)('id').isInt().withMessage('Invalid ID')];
const supplierValidation = {
    CREATE: [
        (0, express_validator_1.body)('name').notEmpty().withMessage('Supplier name is required').isLength({ max: 255 }).withMessage('Name cannot exceed 255 characters'),
        (0, express_validator_1.body)('contactInfo.email').isEmail().withMessage('A valid email is required'),
        (0, express_validator_1.body)('contactInfo.phone').notEmpty().withMessage('Phone number is required').isMobilePhone('any').withMessage('A valid phone number is required')
    ],
    UPDATE: [
        (0, express_validator_1.body)('name').notEmpty().withMessage('Supplier name is required').isLength({ max: 255 }).withMessage('Name cannot exceed 255 characters'),
        (0, express_validator_1.body)('contactInfo.email').isEmail().withMessage('A valid email is required'),
        (0, express_validator_1.body)('contactInfo.phone').notEmpty().withMessage('Phone number is required').isMobilePhone('any').withMessage('A valid phone number is required')
    ]
};
// Public
router.get('/', container_1.supplierController.getAll);
router.get('/:id', idValidation, validation_middleware_1.validateRequest, container_1.supplierController.getById);
// Protected
router.use(auth_middleware_1.authMiddleware);
router.post('/', supplierValidation.CREATE, validation_middleware_1.validateRequest, container_1.supplierController.create);
router.put('/:id', idValidation, supplierValidation.UPDATE, validation_middleware_1.validateRequest, container_1.supplierController.update);
router.delete('/:id', idValidation, validation_middleware_1.validateRequest, container_1.supplierController.delete);
exports.default = router;

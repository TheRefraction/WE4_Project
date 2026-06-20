"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const container_1 = require("../container");
const router = (0, express_1.Router)();
const idValidation = [(0, express_validator_1.param)('id').isInt().withMessage('Invalid ID')];
const categoryValidation = {
    CREATE: [
        (0, express_validator_1.body)('name').notEmpty().withMessage('Category name is required').isLength({ max: 128 }).withMessage('Category name cannot exceed 128 characters')
    ],
    UPDATE: [
        (0, express_validator_1.body)('name').optional().isLength({ max: 128 }).withMessage('Category name cannot exceed 128 characters')
    ]
};
// Public
router.get('/', container_1.categoryController.getAll);
router.get('/:id', idValidation, validation_middleware_1.validateRequest, container_1.categoryController.getById);
// Protected
router.use(auth_middleware_1.authMiddleware);
router.post('/admin', categoryValidation.CREATE, validation_middleware_1.validateRequest, container_1.categoryController.create);
router.put('/admin/:id', idValidation, categoryValidation.UPDATE, validation_middleware_1.validateRequest, container_1.categoryController.update);
router.delete('/admin/:id', idValidation, validation_middleware_1.validateRequest, container_1.categoryController.delete);
exports.default = router;

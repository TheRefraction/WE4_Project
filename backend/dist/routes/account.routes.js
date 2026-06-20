"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const account_model_1 = require("../models/account.model");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const container_1 = require("../container");
const router = (0, express_1.Router)();
const idValidation = [(0, express_validator_1.param)('id').isInt().withMessage('Invalid id')];
// Validation rules
const registerValidation = [
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('phone').optional().isMobilePhone('any').withMessage('Valid phone number is required')
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
];
const updateValidation = [
    (0, express_validator_1.body)('firstName').optional().notEmpty(),
    (0, express_validator_1.body)('lastName').optional().notEmpty(),
    (0, express_validator_1.body)('email').optional().isEmail(),
    (0, express_validator_1.body)('phone').optional(),
    (0, express_validator_1.body)('password').optional().isLength({ min: 6 }),
    (0, express_validator_1.body)('role').optional().isIn(Object.values(account_model_1.Role)).withMessage('Invalid role value')
];
// Public routes
router.post('/register', registerValidation, validation_middleware_1.validateRequest, container_1.accountController.register);
router.post('/login', loginValidation, validation_middleware_1.validateRequest, container_1.accountController.login);
// Protected routes
router.use(auth_middleware_1.authMiddleware);
router.get('/profile', container_1.accountController.getProfile);
router.put('/profile/:id', idValidation, updateValidation, validation_middleware_1.validateRequest, container_1.accountController.updateAccount);
router.delete('/profile/:id', idValidation, validation_middleware_1.validateRequest, container_1.accountController.deleteAccount);
// Admin routes
router.get('/admin/accounts', container_1.accountController.getAllAccounts);
router.get('/admin/accounts/:id', idValidation, validation_middleware_1.validateRequest, container_1.accountController.getAccountById);
exports.default = router;

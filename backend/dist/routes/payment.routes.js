"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const payment_model_1 = require("../models/payment.model");
const router = (0, express_1.Router)();
const paymentController = new payment_controller_1.PaymentController();
const createPaymentValidation = [
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(Object.values(payment_model_1.PaymentStatus))
        .withMessage(`Status must be one of: ${Object.values(payment_model_1.PaymentStatus).join(', ')}`)
];
router.post('/', auth_middleware_1.authMiddleware, createPaymentValidation, validation_middleware_1.validateRequest, paymentController.create);
exports.default = router;

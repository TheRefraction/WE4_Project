"use strict";
/**
 * payment.controller.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../services/payment.service");
const paymentService = new payment_service_1.PaymentService();
class PaymentController {
    async create(req, res, next) {
        try {
            const result = await paymentService.create(req.body);
            return res.status(201).json({
                success: true,
                message: "Payment created successfully",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    ;
}
exports.PaymentController = PaymentController;

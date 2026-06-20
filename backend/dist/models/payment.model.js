"use strict";
/**
 * payment.model.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.PaymentMode = void 0;
exports.PaymentMode = {
    Unknown: 'unknown',
    CreditCard: 'credit_card',
    BankNote: 'bank_note',
    Cash: 'cash',
    MealVoucher: 'meal_voucher',
    Paypal: 'paypal'
};
exports.PaymentStatus = {
    Unknown: 'unknown',
    Pending: 'pending',
    Paid: 'paid',
    Failed: 'failed',
    Refunded: 'refunded'
};

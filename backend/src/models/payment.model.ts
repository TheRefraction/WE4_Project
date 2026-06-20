/**
 * payment.model.ts
 */

export const PaymentMode = {
    Unknown: 'unknown',
    CreditCard: 'credit_card',
    BankNote: 'bank_note',
    Cash: 'cash',
    MealVoucher: 'meal_voucher',
    Paypal: 'paypal'
} as const;

export type PaymentMode = typeof PaymentMode[keyof typeof PaymentMode];

export const PaymentStatus = {
    Unknown: 'unknown',
    Pending: 'pending',
    Paid: 'paid',
    Failed: 'failed',
    Refunded: 'refunded'
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface Payment {
    id: number;
    paymentDate: Date;
    mode: PaymentMode;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePaymentDTO {
    invoiceId: number;
    mode: PaymentMode;
    paymentDate?: Date;
    status?: PaymentStatus;
}

export interface UpdatePaymentDTO {
    paymentDate?: Date;
    mode?: PaymentMode;
    status?: PaymentStatus;
}
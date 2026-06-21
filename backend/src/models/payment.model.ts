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
    readonly id: number;
    mode: PaymentMode;
    status: PaymentStatus;
    paymentDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type CreatePaymentDTO = Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'paymentDate'> 
                                & Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'mode'>>;

export type UpdatePaymentDTO = Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>;

export type PaymentResponse = Payment;
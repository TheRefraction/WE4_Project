export enum PaymentMode {
    UNKNOWN = 'unknown',
    CREDIT_CARD = 'credit_card',
    BANK_NOTE = 'bank_note',
    CASH = 'cash',
    MEAL_VOUCHER = 'meal_voucher',
    PAYPAL = 'paypal'
}

export enum PaymentStatus {
    UNKNOWN = 'unknown',
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

export interface Payment {
    id?: number;
    payment_date: Date;
    mode: PaymentMode;
    status: PaymentStatus;
    created_at?: Date;
    updated_at?: Date;
}
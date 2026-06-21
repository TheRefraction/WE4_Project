/**
 * account.model.ts
 */

import { BaseEntity } from "./base.model";

export const Role = {
    Unknown: 'unknown',
    Client: 'client',
    Supplier: 'supplier',
    Admin: 'admin',
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface Account extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    passwordHash: string;
    createdAt: Date,
    updatedAt: Date,
    lastLogin: Date,
    loyaltyPoints: number;
    role: Role;
}

export type CreateAccountDTO = Pick<
  Account, 
  'firstName' | 'lastName' | 'email' | 'phone' | 'createdAt' | 'updatedAt' | 'lastLogin'
> & { 
  password: string 
};

export type UpdateAccountDTO = Partial<Omit<Account, keyof BaseEntity | 'passwordHash' | 'loyaltyPoints' | 'createdAt' | 'updatedAt' | 'lastLogin' >> & {
    password?: string; // Add back password as an optional field for updates
};

export interface AccountResponse extends Omit<Account, 'passwordHash'> {}
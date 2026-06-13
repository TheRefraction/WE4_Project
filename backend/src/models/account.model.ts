/**
 * account.model.ts
 * 
 * This file defines the TypeScript interfaces for the Account entity and related data transfer objects (DTOs).
 * It also includes the Role interface to represent user roles in the system.
 * These interfaces are used throughout the application to ensure type safety and consistency when working with account data.
 */

export const Role = {
    Unknown: 'unknown',
    Client: 'client',
    Supplier: 'supplier',
    Admin: 'admin',
} as const;

export type Role = typeof Role[keyof typeof Role];

/**
 * This interface defines the structure of the Account entity as stored in the database.
 */
export interface Account {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    loyaltyPoints: number;
    role: Role;
}

/**
 * This interface defines the structure of the data required to create a new account.
 */
export interface CreateAccountDTO {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
}

/**
 * This interface defines the structure of the data required to update an existing account. 
 */
export interface UpdateAccountDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: Role;
}

/**
 * This interface defines the structure of the account data that will be sent in API responses. 
 * It excludes sensitive information like passwordHash and 
 * includes the role name instead of roleId for better readability.
 */
export interface AccountResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
    loyaltyPoints: number;
    role: Role;
}
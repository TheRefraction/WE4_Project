/**
 * account.service.ts
 * 
 * This file defines the AccountService class, which provides methods for handling business logic related to user accounts.
 * It interacts with the AccountRepository to perform database operations and includes methods for creating accounts, authenticating users, updating account information, and more.
 * The service also handles password hashing using bcrypt and JWT token generation for authentication.
 * By centralizing the business logic in this service layer, we can keep our controllers clean and focused on handling HTTP requests and responses.
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { AccountRepository } from '../repositories/account.repository';
import { CreateAccountDTO, UpdateAccountDTO, AccountResponse, Role } from '../models/account.model';
import { AppError } from '../middlewares/error.middleware';

export class AccountService {
    private accountRepository: AccountRepository;

    constructor() {
        this.accountRepository = new AccountRepository();
    }

    async getAllAccounts(role?: Role): Promise<AccountResponse[]> {
        const accounts = await this.accountRepository.findAll(role);

        return Promise.all(accounts.map((account) => this.mapToResponse(account)));
    }

    async getAccountById(id: number): Promise<AccountResponse | null> {
        const account = await this.accountRepository.findById(id);
        if (!account) throw new AppError('Account not found', 404);

        return this.mapToResponse(account);
    }

    async getAccountByEmail(email: string): Promise<AccountResponse | null> {
        const account = await this.accountRepository.findByEmail(email);
        if (!account) throw new AppError('Account not found', 404);

        return this.mapToResponse(account);
    }

    async register(data: CreateAccountDTO) {
        const existingAccount = await this.accountRepository.findByEmail(data.email);

        if (existingAccount) {
            throw new AppError('Email already in use', 409);
        }

        if (data.password.length < 6) {
            throw new AppError('Password must be at least 6 characters long', 400);
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const account = await this.accountRepository.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            passwordHash: passwordHash,
        });

        const accountResponse = await this.mapToResponse(account);
        const token = this.generateToken(accountResponse);

        return { 
            account: accountResponse, 
            token 
        };
    }

    async login(email: string, password: string) {
        const account = await this.accountRepository.findByEmail(email);

        if (!account) {
            throw new AppError('Invalid email or password', 401);
        }

        const isPasswordValid = await bcrypt.compare(password, account.passwordHash);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        const accountResponse = await this.mapToResponse(account);
        const token = this.generateToken(accountResponse);

        return { 
            account: accountResponse, 
            token 
        };
    }

    async updateAccount(id: number, data: UpdateAccountDTO, requesterId: number): Promise<AccountResponse> {
        const account = await this.accountRepository.findById(id);

        if (!account) {
            throw new AppError('Account not found', 404);
        }

        const requesterAccount = await this.accountRepository.findById(requesterId);

        if (!requesterAccount) {
            throw new AppError('Requester account not found', 404);
        }

        const isAdmin = requesterAccount.role === Role.Admin;

        if (account.id !== requesterId && !isAdmin) {
            throw new AppError('Permission denied', 403);
        }

        // Only an admin can change roles, and only to a valid Role value
        if (data.role !== undefined) {
            if (!isAdmin) {
                throw new AppError('Permission denied', 403);
            }

            if (!Object.values(Role).includes(data.role)) {
                throw new AppError('Invalid role value', 400);
            }

            if (account.id === requesterId && data.role !== Role.Admin) {
                throw new AppError('Admins cannot demote themselves', 400);
            }
        }

        if (data.password) {
            if (data.password.length < 6) {
                throw new AppError('Password must be at least 6 characters long', 400);
            }

            data.password = await bcrypt.hash(data.password, 10);
        }

        if (data.email && data.email !== account.email) {
            const existingAccount = await this.accountRepository.findByEmail(data.email);
            if (existingAccount) {
                throw new AppError('Email already in use', 409);
            }
        }

        const updatedAccount = await this.accountRepository.update(id, data);
        if (!updatedAccount) throw new AppError('Failed to update account', 500);

        return this.mapToResponse(updatedAccount);
    }

    async deleteAccount(id: number, requesterId: number) {
        const account = await this.accountRepository.findById(id);

        if (!account) {
            throw new AppError('Account not found', 404);
        }

        const requesterAccount = await this.accountRepository.findById(requesterId);

        if (!requesterAccount) {
            throw new AppError('Requester account not found', 404);
        }

        const isAdmin = requesterAccount.role === Role.Admin;

        if (account.id !== requesterId && !isAdmin) {
            throw new AppError('Permission denied', 403);
        }

        const success = await this.accountRepository.delete(id);
        if (!success) throw new AppError('Failed to delete account', 500);

        return { success: true };
    }

    private generateToken(account: AccountResponse): string {
        const payload = {
            userId: account.id,
            email: account.email,
            role: account.role,
        };

        return jwt.sign(
            payload, 
            env.JWT_SECRET!, 
            { expiresIn: env.JWT_EXPIRES_IN }
        );
    }

    private async mapToResponse(account: any): Promise<AccountResponse> {
        return {
            id: account.id,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            phone: account.phone,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
            loyaltyPoints: account.loyaltyPoints,
            role: account.role
        };
    }
}
/**
 * account.service.ts
 */

import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

import { env } from '../config/env';
import { AccountRepository } from '../repositories/account.repository';
import { CreateAccountDTO, UpdateAccountDTO, AccountResponse, Role } from '../models/account.model';
import { AppError } from '../middlewares/error.middleware';
import { HttpStatus } from '../utils/httpStatus';

const passwordMinLength = 6;
const passwordSalt = 10;

export class AccountService {
    constructor(private repo: AccountRepository) {}

    async getAll(role?: Role): Promise<AccountResponse[]> {
        const accounts = await this.repo.findAll(role);

        return Promise.all(accounts.map((account) => this.mapToResponse(account)));
    }

    async getById(id: number): Promise<AccountResponse | null> {
        const account = await this.repo.findById(id);
        if (!account) throw new AppError('Account not found', HttpStatus.NOT_FOUND);

        return this.mapToResponse(account);
    }

    async getByEmail(email: string): Promise<AccountResponse | null> {
        const account = await this.repo.findByEmail(email);
        if (!account) throw new AppError('Account not found', HttpStatus.NOT_FOUND);

        return this.mapToResponse(account);
    }

    async register(data: CreateAccountDTO): Promise<{ 
        account: AccountResponse; 
        token: string; 
    }> {
        const existingAccount = await this.repo.findByEmail(data.email);

        if (existingAccount) {
            throw new AppError('Email already in use', HttpStatus.CONFLICT);
        }

        if (data.password.length < passwordMinLength) {
            throw new AppError('Password must be at least 6 characters long', HttpStatus.BAD_REQUEST);
        }

        const passwordHash = await bcrypt.hash(data.password, passwordSalt);

        const account = await this.repo.create({
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

    async login(email: string, password: string): Promise<{ 
        account: AccountResponse; 
        token: string; 
    }> {
        const account = await this.repo.findByEmail(email);

        if (!account) {
            throw new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }

        const isPasswordValid = await bcrypt.compare(password, account.passwordHash);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }

        const accountResponse = await this.mapToResponse(account);
        const token = this.generateToken(accountResponse);

        return { 
            account: accountResponse,
            token 
        };
    }

    async update(id: number, data: UpdateAccountDTO, requesterId: number): Promise<AccountResponse> {
        const account = await this.repo.findById(id);

        if (!account) {
            throw new AppError('Account not found', HttpStatus.NOT_FOUND);
        }

        const requesterAccount = await this.repo.findById(requesterId);

        if (!requesterAccount) {
            throw new AppError('Requester account not found', HttpStatus.NOT_FOUND);
        }

        const isAdmin = requesterAccount.role === Role.Admin;

        if (account.id !== requesterId && !isAdmin) {
            throw new AppError('Permission denied', HttpStatus.FORBIDDEN);
        }

        // Only an admin can change roles, and only to a valid Role value
        if (data.role !== undefined) {
            if (!isAdmin) {
                throw new AppError('Permission denied', HttpStatus.FORBIDDEN);
            }

            if (!Object.values(Role).includes(data.role)) {
                throw new AppError('Invalid role value', HttpStatus.BAD_REQUEST);
            }

            if (account.id === requesterId && data.role !== Role.Admin) {
                throw new AppError('Admins cannot demote themselves', HttpStatus.BAD_REQUEST);
            }
        }

        if (data.password) {
            if (data.password.length < passwordMinLength) {
                throw new AppError('Password must be at least 6 characters long', HttpStatus.BAD_REQUEST);
            }

            data.password = await bcrypt.hash(data.password, passwordSalt);
        }

        if (data.email && data.email !== account.email) {
            const existingAccount = await this.repo.findByEmail(data.email);
            if (existingAccount) {
                throw new AppError('Email already in use', HttpStatus.CONFLICT);
            }
        }

        const updatedAccount = await this.repo.update(id, data);
        if (!updatedAccount) throw new AppError('Failed to update account', HttpStatus.INTERNAL_SERVER_ERROR);

        return this.mapToResponse(updatedAccount);
    }

    async delete(id: number, requesterId: number): Promise<{ success: boolean }> {
        const account = await this.repo.findById(id);

        if (!account) {
            throw new AppError('Account not found', HttpStatus.NOT_FOUND);
        }

        const requesterAccount = await this.repo.findById(requesterId);

        if (!requesterAccount) {
            throw new AppError('Requester account not found', HttpStatus.NOT_FOUND);
        }

        const isAdmin = requesterAccount.role === Role.Admin;

        if (account.id !== requesterId && !isAdmin) {
            throw new AppError('Permission denied', HttpStatus.FORBIDDEN);
        }

        const success = await this.repo.delete(id);
        if (!success) throw new AppError('Failed to delete account', HttpStatus.INTERNAL_SERVER_ERROR);

        return { success: success };
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
            { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] }
        );
    }

    private async mapToResponse(account: any): Promise<AccountResponse> {
        return {
            id: account.id,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            phone: account.phone ?? null,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
            loyaltyPoints: account.loyaltyPoints,
            role: account.role
        };
    }
}
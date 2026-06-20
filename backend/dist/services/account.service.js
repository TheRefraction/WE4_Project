"use strict";
/**
 * account.service.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const account_model_1 = require("../models/account.model");
const error_middleware_1 = require("../middlewares/error.middleware");
const passwordMinLength = 6;
const passwordSalt = 10;
class AccountService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getAll(role) {
        const accounts = await this.repo.findAll(role);
        return Promise.all(accounts.map((account) => this.mapToResponse(account)));
    }
    async getById(id) {
        const account = await this.repo.findById(id);
        if (!account)
            throw new error_middleware_1.AppError('Account not found', 404 /* HttpStatus.NOT_FOUND */);
        return this.mapToResponse(account);
    }
    async getByEmail(email) {
        const account = await this.repo.findByEmail(email);
        if (!account)
            throw new error_middleware_1.AppError('Account not found', 404 /* HttpStatus.NOT_FOUND */);
        return this.mapToResponse(account);
    }
    async register(data) {
        const existingAccount = await this.repo.findByEmail(data.email);
        if (existingAccount) {
            throw new error_middleware_1.AppError('Email already in use', 409 /* HttpStatus.CONFLICT */);
        }
        if (data.password.length < passwordMinLength) {
            throw new error_middleware_1.AppError('Password must be at least 6 characters long', 400 /* HttpStatus.BAD_REQUEST */);
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, passwordSalt);
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
    async login(email, password) {
        const account = await this.repo.findByEmail(email);
        if (!account) {
            throw new error_middleware_1.AppError('Invalid email or password', 401 /* HttpStatus.UNAUTHORIZED */);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, account.passwordHash);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError('Invalid email or password', 401 /* HttpStatus.UNAUTHORIZED */);
        }
        const accountResponse = await this.mapToResponse(account);
        const token = this.generateToken(accountResponse);
        return {
            account: accountResponse,
            token
        };
    }
    async update(id, data, requesterId) {
        const account = await this.repo.findById(id);
        if (!account) {
            throw new error_middleware_1.AppError('Account not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const requesterAccount = await this.repo.findById(requesterId);
        if (!requesterAccount) {
            throw new error_middleware_1.AppError('Requester account not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const isAdmin = requesterAccount.role === account_model_1.Role.Admin;
        if (account.id !== requesterId && !isAdmin) {
            throw new error_middleware_1.AppError('Permission denied', 403 /* HttpStatus.FORBIDDEN */);
        }
        // Only an admin can change roles, and only to a valid Role value
        if (data.role !== undefined) {
            if (!isAdmin) {
                throw new error_middleware_1.AppError('Permission denied', 403 /* HttpStatus.FORBIDDEN */);
            }
            if (!Object.values(account_model_1.Role).includes(data.role)) {
                throw new error_middleware_1.AppError('Invalid role value', 400 /* HttpStatus.BAD_REQUEST */);
            }
            if (account.id === requesterId && data.role !== account_model_1.Role.Admin) {
                throw new error_middleware_1.AppError('Admins cannot demote themselves', 400 /* HttpStatus.BAD_REQUEST */);
            }
        }
        if (data.password) {
            if (data.password.length < passwordMinLength) {
                throw new error_middleware_1.AppError('Password must be at least 6 characters long', 400 /* HttpStatus.BAD_REQUEST */);
            }
            data.password = await bcrypt_1.default.hash(data.password, passwordSalt);
        }
        if (data.email && data.email !== account.email) {
            const existingAccount = await this.repo.findByEmail(data.email);
            if (existingAccount) {
                throw new error_middleware_1.AppError('Email already in use', 409 /* HttpStatus.CONFLICT */);
            }
        }
        const updatedAccount = await this.repo.update(id, data);
        if (!updatedAccount)
            throw new error_middleware_1.AppError('Failed to update account', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        return this.mapToResponse(updatedAccount);
    }
    async delete(id, requesterId) {
        const account = await this.repo.findById(id);
        if (!account) {
            throw new error_middleware_1.AppError('Account not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const requesterAccount = await this.repo.findById(requesterId);
        if (!requesterAccount) {
            throw new error_middleware_1.AppError('Requester account not found', 404 /* HttpStatus.NOT_FOUND */);
        }
        const isAdmin = requesterAccount.role === account_model_1.Role.Admin;
        if (account.id !== requesterId && !isAdmin) {
            throw new error_middleware_1.AppError('Permission denied', 403 /* HttpStatus.FORBIDDEN */);
        }
        const success = await this.repo.delete(id);
        if (!success)
            throw new error_middleware_1.AppError('Failed to delete account', 500 /* HttpStatus.INTERNAL_SERVER_ERROR */);
        return { success: success };
    }
    generateToken(account) {
        const payload = {
            userId: account.id,
            email: account.email,
            role: account.role,
        };
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
    }
    async mapToResponse(account) {
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
exports.AccountService = AccountService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    // General
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CORS_ORIGINS: process.env.CORS_ORIGINS || '*',
    // PostgreSQL
    PG_HOST: process.env.POSTGRES_HOST || 'localhost',
    PG_PORT: Number(process.env.POSTGRES_PORT) || 5432,
    PG_DB: process.env.POSTGRES_DB || '',
    PG_USER: process.env.POSTGRES_APP_USER || '',
    PG_PASSWORD: process.env.POSTGRES_APP_PASSWORD || '',
    // MongoDB
    MONGO_URI: process.env.MONGO_URI || '',
};

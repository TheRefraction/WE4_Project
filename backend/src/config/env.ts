import dotenv from 'dotenv';

dotenv.config();

export const env = {
    // General
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CORS_ORIGINS: process.env.CORS_ORIGINS || '*',

    // PostgreSQL
    PG_HOST: process.env.POSTGRES_HOST || 'localhost',
    PG_PORT: parseInt(process.env.POSTGRES_PORT) || 5432,
    PG_DB: process.env.POSTGRES_DB || '',
    PG_USER: process.env.POSTGRES_APP_USER || '',
    PG_PASSWORD: process.env.POSTGRES_APP_PASSWORD || '',

    // MongoDB
    MONGO_URI: process.env.MONGO_URI || '',
};
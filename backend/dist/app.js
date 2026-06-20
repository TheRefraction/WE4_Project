"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const mongo_1 = require("./config/mongo");
const postgres_1 = require("./config/postgres");
const env_1 = require("./config/env");
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        const allowedOrigins = new Set(env_1.env.CORS_ORIGINS
            .split(',')
            .map(origin => origin.trim())
            .filter(Boolean));
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.has(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new error_middleware_1.AppError('Origin not allowed', 403));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, morgan_1.default)('combined'));
    }
    initializeRoutes() {
        this.app.use('/api', routes_1.default);
        this.app.get('/api/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date() });
        });
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.errorMiddleware);
    }
    async init() {
        try {
            await Promise.all([
                // Initialize PostgreSQL
                postgres_1.pgPool.query('SELECT 1'),
                // Initialize MongoDB
                (0, mongo_1.connectMongoDB)(),
            ]);
        }
        catch (error) {
            console.error('Database initialization failed:', error);
            process.exit(1);
        }
    }
    getApp() {
        return this.app;
    }
}
exports.default = new App();

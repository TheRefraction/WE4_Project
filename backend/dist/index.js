"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const PORT = 3000;
(async () => {
    await app_1.default.init();
    const server = app_1.default.getApp().listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${env_1.env.NODE_ENV}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
    const gracefulShutdown = () => {
        console.log('Received shutdown signal, closing server...');
        server.close(async () => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    };
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
})();

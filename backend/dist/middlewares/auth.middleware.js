"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const account_model_1 = require("../models/account.model");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            res.status(401 /* HttpStatus.UNAUTHORIZED */).json({ success: false, message: 'Authentication required' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401 /* HttpStatus.UNAUTHORIZED */).json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = async (req, res, next) => {
    if (req.user?.role !== account_model_1.Role.Admin) {
        res.status(403 /* HttpStatus.FORBIDDEN */).json({ success: false, message: 'Admin access required' });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;

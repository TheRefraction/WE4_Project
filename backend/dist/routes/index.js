"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_routes_1 = __importDefault(require("./account.routes"));
const supplier_routes_1 = __importDefault(require("./supplier.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const customization_routes_1 = __importDefault(require("./customization.routes"));
const payment_routes_1 = __importDefault(require("./payment.routes"));
const invoice_routes_1 = __importDefault(require("./invoice.routes"));
const menu_routes_1 = __importDefault(require("./menu.routes"));
const API_VERSION = 'v1';
const router = (0, express_1.Router)();
// Version 1
router.use(`/${API_VERSION}/customizations`, customization_routes_1.default);
router.use(`/${API_VERSION}/suppliers`, supplier_routes_1.default);
router.use(`/${API_VERSION}/products`, product_routes_1.default);
router.use(`/${API_VERSION}/categories`, category_routes_1.default);
router.use(`/${API_VERSION}/payments`, payment_routes_1.default);
router.use(`/${API_VERSION}/invoices`, invoice_routes_1.default);
router.use(`/${API_VERSION}/menus`, menu_routes_1.default);
router.use(`/${API_VERSION}`, account_routes_1.default);
exports.default = router;

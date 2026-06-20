"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceStatus = void 0;
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["UNKNOWN"] = "unknown";
    InvoiceStatus["DRAFT"] = "draft";
    InvoiceStatus["PENDING"] = "paid";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["CANCELLED"] = "cancelled";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));

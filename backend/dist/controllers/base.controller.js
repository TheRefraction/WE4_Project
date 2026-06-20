"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    sendResponse(res, status = 200 /* HttpStatus.OK */, message = "OK", data = null) {
        const response = {
            success: status < 400 /* HttpStatus.BAD_REQUEST */,
            message,
            data
        };
        if (Array.isArray(data)) {
            response.count = data.length;
        }
        res.status(status).json(response);
    }
}
exports.BaseController = BaseController;

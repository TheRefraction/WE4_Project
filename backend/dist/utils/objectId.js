"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectIdArray = exports.toObjectId = exports.isValidObjectId = void 0;
const mongodb_1 = require("mongodb");
const isValidObjectId = (id) => {
    return mongodb_1.ObjectId.isValid(id);
};
exports.isValidObjectId = isValidObjectId;
const toObjectId = (id) => {
    if (!(0, exports.isValidObjectId)(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new mongodb_1.ObjectId(id);
};
exports.toObjectId = toObjectId;
const toObjectIdArray = (ids) => {
    return ids.map(id => (0, exports.toObjectId)(id));
};
exports.toObjectIdArray = toObjectIdArray;

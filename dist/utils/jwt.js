"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.sign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function sign(payload, options) {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, Object.assign({}, options));
    return token;
}
exports.sign = sign;
function verify(token) {
    try {
        const decodedURL = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        return decodedURL;
    }
    catch (e) {
        throw e;
    }
}
exports.verify = verify;

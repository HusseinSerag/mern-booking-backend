"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, error) {
        super(message);
        this.error = error;
        this.isTrusted = true;
    }
}
exports.AppError = AppError;

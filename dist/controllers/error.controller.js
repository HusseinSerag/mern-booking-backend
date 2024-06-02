"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const customError_1 = require("./../utils/customError");
function ErrorHandler(err, req, res, next) {
    if (err instanceof customError_1.AppError) {
        return res.status(400).json({
            message: err.message,
            error: err.error,
        });
    }
    else {
        return res.status(500).json({
            message: "Something went wrong!",
        });
    }
}
exports.ErrorHandler = ErrorHandler;

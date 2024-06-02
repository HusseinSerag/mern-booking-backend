"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const logger_1 = require("../utils/logger");
const customError_1 = require("../utils/customError");
function validate(schema) {
    return function (req, res, next) {
        try {
            const result = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            if (result.error) {
                const errorMessage = JSON.parse(result.error.message).map((el) => el.message);
                throw new customError_1.AppError("Invalid input", errorMessage);
            }
            next();
        }
        catch (e) {
            logger_1.log.error(e);
            next(e);
        }
    };
}
exports.validate = validate;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserHandler = void 0;
const user_service_1 = require("../services/user.service");
const logger_1 = require("../utils/logger");
const jwt_1 = require("../utils/jwt");
function registerUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, firstName, lastName, password } = req.body;
        try {
            yield (0, user_service_1.findUser)(email, user_service_1.ifUserExist);
            const user = yield (0, user_service_1.createUser)(email, firstName, password, lastName);
            const token = (0, jwt_1.sign)({ userId: user._id }, {
                expiresIn: "1d",
            });
            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });
            return res.status(200).json({
                message: "Account successfully created!",
            });
        }
        catch (e) {
            logger_1.log.error(e);
            return next(e);
        }
    });
}
exports.registerUserHandler = registerUserHandler;

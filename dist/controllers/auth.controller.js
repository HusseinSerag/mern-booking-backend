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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmEmailHandler = exports.logoutHandler = exports.requestConfirmEmailHandler = exports.getCurrentUserHandler = exports.loginUserHandler = void 0;
const logger_1 = require("../utils/logger");
const user_service_1 = require("../services/user.service");
const customError_1 = require("../utils/customError");
const jwt_1 = require("../utils/jwt");
const lodash_1 = require("lodash");
const email_1 = require("../utils/email");
const encrypt_1 = __importDefault(require("../utils/encrypt"));
function loginUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield (0, user_service_1.findUser)(email, user_service_1.ifUserDoesNotExist);
            if (user.loginLocked && new Date(user.loginLocked).getTime() > Date.now()) {
                user.numberOfLogins = 0;
                yield user.save();
                throw new customError_1.AppError("Please login later!");
            }
            const isMatch = yield user.comparePasswords(password);
            if (!isMatch) {
                user.numberOfLogins = user.numberOfLogins + 1;
                yield user.save();
                if (user.numberOfLogins >= 5) {
                    user.loginLocked = new Date(Date.now() + 30 * 60 * 1000);
                    yield user.save();
                    throw new customError_1.AppError("You tried logging in too much , please try again later!");
                }
                throw new customError_1.AppError("Password is incorrect!");
            }
            const token = (0, jwt_1.sign)({ userId: user._id }, {
                expiresIn: "1d",
            });
            user.numberOfLogins = 0;
            user.loginLocked = null;
            yield user.save();
            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });
            res.status(200).json({ userId: user._id });
        }
        catch (e) {
            logger_1.log.error(e);
            next(e);
        }
    });
}
exports.loginUserHandler = loginUserHandler;
function getCurrentUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(200).json({
            user: (0, lodash_1.omit)(req.user.toObject(), ["password"]),
        });
    });
}
exports.getCurrentUserHandler = getCurrentUserHandler;
function requestConfirmEmailHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const email = user.email;
        try {
            const token = user.createRequestEmailConfirmationToken();
            res.status(200).json({
                message: "successful",
                token,
            });
            yield (0, email_1.sendEmail)({
                subject: "Confirm Email",
                email: email,
                html: `Hello ${user.firstName}! Please confirm your mail by clicking on this <a href="${process.env.FRONTEND_URL}/verify/${token}" target="_blank"> link </a>`,
            });
            yield user.save();
        }
        catch (e) {
            next(e);
        }
    });
}
exports.requestConfirmEmailHandler = requestConfirmEmailHandler;
function logoutHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.cookie("auth_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({
            message: "User logged out successfully!",
        });
    });
}
exports.logoutHandler = logoutHandler;
function confirmEmailHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.params;
        try {
            const user = yield (0, user_service_1.findUserByConfirmEmailToken)((0, encrypt_1.default)(token));
            user.emailConfirmationToken = "";
            user.emailConfirmationExpireTime = null;
            user.isEmailConfirmed = true;
            user.emailConfirmedAt = new Date(Date.now());
            yield user.save();
            const authToken = (0, jwt_1.sign)({ userId: user._id }, {
                expiresIn: "1d",
            });
            res.cookie("auth_token", authToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });
            res.status(200).json({ message: "success" });
        }
        catch (e) {
            next(e);
        }
    });
}
exports.confirmEmailHandler = confirmEmailHandler;

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
exports.findUserByConfirmEmailToken = exports.findUserById = exports.createUser = exports.ifUserDoesNotExist = exports.ifUserExist = exports.findUser = void 0;
const user_model_1 = require("../models/user.model");
const customError_1 = require("../utils/customError");
function findUser(email, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.User.findOne({ email });
        return fn(user);
    });
}
exports.findUser = findUser;
function ifUserExist(user) {
    if (user) {
        throw new customError_1.AppError("User already exists!");
    }
    return Promise.resolve(null);
}
exports.ifUserExist = ifUserExist;
function ifUserDoesNotExist(user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!user) {
            throw new customError_1.AppError("User doesn't exist!");
        }
        return user;
    });
}
exports.ifUserDoesNotExist = ifUserDoesNotExist;
function createUser(email, firstName, password, lastName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.create({
                email,
                firstName,
                password,
                lastName,
            });
            return user;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.createUser = createUser;
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findById(id);
            if (!user) {
                throw new customError_1.AppError("User doesn't exist!");
            }
            return user;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.findUserById = findUserById;
function findUserByConfirmEmailToken(emailConfirmationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findOne({
                emailConfirmationToken,
                emailConfirmationExpireTime: {
                    $gt: Date.now(),
                },
            });
            if (!user) {
                throw new customError_1.AppError("Token is invalid or expired!");
            }
            return user;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.findUserByConfirmEmailToken = findUserByConfirmEmailToken;

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
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const customError_1 = require("../utils/customError");
const encrypt_1 = __importDefault(require("../utils/encrypt"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    isEmailConfirmed: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
    },
    emailConfirmationToken: String,
    emailConfirmationExpireTime: Date,
    emailConfirmedAt: Date,
    numberOfLogins: {
        type: Number,
        default: 0,
    },
    loginLocked: Date,
}, {
    timestamps: true,
    methods: {
        comparePasswords(incomingPassword) {
            return bcryptjs_1.default.compare(incomingPassword, this.password);
        },
        checkIfTokenIsNew(time) {
            if (this.emailConfirmedAt) {
                const changedTime = parseInt((this.emailConfirmedAt.getTime() / 1000).toString(), 10);
                return time < changedTime;
            }
            return false;
        },
        createRequestEmailConfirmationToken() {
            try {
                if (this.isEmailConfirmed) {
                    throw new customError_1.AppError("Email is already confirmed!");
                }
                if (this.emailConfirmationExpireTime &&
                    this.emailConfirmationExpireTime.getTime() > Date.now()) {
                    throw new customError_1.AppError("Cannot issue another token!");
                }
                const token = crypto_1.default.randomBytes(32).toString("hex");
                this.emailConfirmationToken = (0, encrypt_1.default)(token);
                this.emailConfirmationExpireTime = new Date(Date.now() + 3600000);
                return token;
            }
            catch (e) {
                throw e;
            }
        },
    },
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified("password")) {
            return next();
        }
        user.password = yield bcryptjs_1.default.hash(user.password, yield bcryptjs_1.default.genSalt(8));
        next();
    });
});
exports.User = mongoose_1.default.model("User", userSchema);

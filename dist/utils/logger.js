"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_pretty_1 = __importDefault(require("pino-pretty"));
const stream = (0, pino_pretty_1.default)({
    levelFirst: true,
    colorize: true,
    ignore: "pid",
});
exports.log = (0, pino_1.default)(stream);

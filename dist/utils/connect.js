"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger");
function connect() {
    const dbUri = process.env.MONGODB_CONNECTION_STRING;
    return mongoose_1.default
        .connect(dbUri)
        .then(() => {
        logger_1.log.info("Database connected successfully ");
    })
        .catch((e) => {
        logger_1.log.fatal(e);
        logger_1.log.error("Crashing server....");
        process.exit(1);
    });
}
exports.connect = connect;

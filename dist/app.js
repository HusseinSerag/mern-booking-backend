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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./utils/logger");
const connect_1 = require("./utils/connect");
const routes_1 = require("./routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
if (process.env.NODE_ENV === "testing") {
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../e2e.env") });
}
else {
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../config.env") });
}
logger_1.log.info(process.env.FRONTEND_URL);
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json({
    limit: "10kb",
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.get("/api/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendStatus(200);
}));
app.listen(8000, () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.log.info("Server started at port 8000");
    yield (0, connect_1.connect)();
    (0, routes_1.routes)(app);
}));

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const users_route_1 = __importDefault(require("./routes/users.route"));
const error_controller_1 = require("./controllers/error.controller");
function routes(app) {
    app.use("/api/users", users_route_1.default);
    app.use(error_controller_1.ErrorHandler);
}
exports.routes = routes;

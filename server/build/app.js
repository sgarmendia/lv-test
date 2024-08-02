"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var users_1 = __importDefault(require("./routes/users"));
var errorHandling_1 = require("./middlewares/errorHandling");
app.use(express_1.default.json());
(0, users_1.default)(app);
app.use(errorHandling_1.errorMiddleware);
exports.default = app;

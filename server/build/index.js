"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var db_1 = __importDefault(require("./db"));
db_1.default.init().then(function () {
    console.log("Database initialized");
    process.once("SIGTERM", function () { return db_1.default.close(); }).once("SIGINT", function () { return db_1.default.close(); });
});
app_1.default.listen(5000, function () {
    console.log("Server listening on port 5000");
});

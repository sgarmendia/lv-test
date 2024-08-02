"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
var errorMiddleware = function (err, _req, res) {
    console.error(err.message);
    res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
};
exports.errorMiddleware = errorMiddleware;

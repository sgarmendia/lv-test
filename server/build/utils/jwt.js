"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var JWT_SECRET = process.env.JWT_SECRET || "secret1234567890";
var generateToken = function (data) {
    var jwt = (0, jsonwebtoken_1.sign)({ data: data }, JWT_SECRET, {
        expiresIn: "1d",
    });
    return jwt;
};
exports.generateToken = generateToken;
var verifyToken = function (jwt) {
    var data = (0, jsonwebtoken_1.verify)(jwt, JWT_SECRET).data;
    return JSON.parse(data);
};
exports.verifyToken = verifyToken;

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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.userLogin = exports.userSignup = void 0;
var validation_1 = require("../utils/validation");
var db_1 = __importDefault(require("../db"));
var auth_1 = require("../utils/auth");
var jwt_1 = require("../utils/jwt");
var userSignup = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, name, role, validateUser, checkUser, hashedPassword, token, registeredNewUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, name = _a.name, role = _a.role;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                validateUser = validation_1.createUserSchema.safeParse({
                    email: email,
                    password: password,
                    name: name,
                    role: role,
                });
                if (!validateUser.success) {
                    next(validateUser.error.message);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.default.client.query("SELECT * FROM users WHERE email = $1", [email])];
            case 2:
                checkUser = _b.sent();
                if (checkUser.rows[0]) {
                    res.status(409).send({ status: "error", message: "User already exists" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, auth_1.encrypt)(password)];
            case 3:
                hashedPassword = _b.sent();
                token = (0, jwt_1.generateToken)(JSON.stringify({ email: email, role: role, name: name }));
                return [4 /*yield*/, db_1.default.client.query("INSERT INTO users (name, email, password, role, access_token) VALUES ($1, $2, $3, $4, $5) RETURNING *", [name, email, hashedPassword, role, token])];
            case 4:
                registeredNewUser = _b.sent();
                res.status(201).json({
                    status: "success",
                    message: "User created successfully",
                    data: {
                        id: registeredNewUser.rows[0].id,
                        name: registeredNewUser.rows[0].name,
                        email: registeredNewUser.rows[0].email,
                        role: registeredNewUser.rows[0].role,
                        token: registeredNewUser.rows[0].access_token,
                    },
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.userSignup = userSignup;
var userLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, validateUser, userData, user, isPasswordValid, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                validateUser = validation_1.loginUserSchema.safeParse({ email: email, password: password });
                if (!validateUser.success) {
                    next(validateUser.error.message);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.default.client.query("SELECT * FROM users WHERE email = $1", [email])];
            case 2:
                userData = _b.sent();
                user = userData.rows[0];
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, auth_1.verify)(password, user.password)];
            case 3:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    res
                        .status(401)
                        .json({ status: "error", message: "Invalid email or password" });
                    return [2 /*return*/];
                }
                token = (0, jwt_1.generateToken)(JSON.stringify({ email: user.email, role: user.role, name: user.name }));
                res.status(200).json({ token: token });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.userLogin = userLogin;
var getUsers = function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.default.client.query("SELECT * FROM users")];
            case 1:
                result = _a.sent();
                res.json(result.rows);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsers = getUsers;
var getUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, currentUser, isUser, result, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                currentUser = req.user;
                isUser = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === validation_1.Role.USER;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.default.client.query("SELECT * FROM users WHERE id = $1", [
                        id,
                    ])];
            case 2:
                result = _a.sent();
                user = result.rows[0];
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return [2 /*return*/];
                }
                if (isUser && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.email) !== user.email) {
                    res.status(403).json({ message: "A user can only get his own data." });
                    return [2 /*return*/];
                }
                res.status(200).json(user);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
var updateUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, email, password, role, currentUser, isUser, validateUser, result, existingUser, updatedEmail, updatedPassword, _b, updatedName, updatedRole, token, dataToUpdate, updatedUserResult, error_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, role = _a.role;
                currentUser = req.user;
                isUser = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === validation_1.Role.USER;
                if (isUser && role !== undefined) {
                    res.status(403).json({ message: "A User can not change its own Role" });
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                validateUser = validation_1.updateUserSchema.safeParse({
                    name: name,
                    email: email,
                    password: password,
                    role: role,
                });
                if (!validateUser.success) {
                    res.status(400).json({ message: validateUser.error.message });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.default.client.query("SELECT * FROM users WHERE id = $1", [
                        id,
                    ])];
            case 2:
                result = _c.sent();
                existingUser = result.rows[0];
                console.log({ existingUser: existingUser });
                if (!existingUser) {
                    res.status(404).json({ message: "User not found" });
                    return [2 /*return*/];
                }
                if (isUser && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.email) !== existingUser.email) {
                    res.status(403).json({ message: "A user can only update his own data." });
                    return [2 /*return*/];
                }
                updatedEmail = email !== null && email !== void 0 ? email : existingUser.email;
                if (!password) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, auth_1.encrypt)(password)];
            case 3:
                _b = _c.sent();
                return [3 /*break*/, 5];
            case 4:
                _b = existingUser.password;
                _c.label = 5;
            case 5:
                updatedPassword = _b;
                updatedName = name !== null && name !== void 0 ? name : existingUser.name;
                updatedRole = role !== null && role !== void 0 ? role : existingUser.role;
                token = (0, jwt_1.generateToken)(JSON.stringify({
                    email: updatedEmail,
                    role: updatedRole,
                    name: updatedName,
                }));
                dataToUpdate = [
                    updatedEmail,
                    updatedPassword,
                    updatedName,
                    updatedRole,
                    token,
                    id,
                ];
                return [4 /*yield*/, db_1.default.client.query("UPDATE users SET email = $1, password = $2, name = $3, role = $4, access_token = $5 WHERE id = $6 RETURNING *", dataToUpdate)];
            case 6:
                updatedUserResult = _c.sent();
                res.status(200).json({
                    message: "User updated successfully",
                    data: {
                        id: updatedUserResult.rows[0].id,
                        email: updatedUserResult.rows[0].email,
                        name: updatedUserResult.rows[0].name,
                        role: updatedUserResult.rows[0].role,
                        token: updatedUserResult.rows[0].access_token,
                    },
                });
                return [3 /*break*/, 8];
            case 7:
                error_5 = _c.sent();
                next(error_5);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
var deleteUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, currentUser, result, existingUser, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                currentUser = req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.default.client.query("SELECT * FROM users WHERE id = $1", [
                        id,
                    ])];
            case 2:
                result = _a.sent();
                existingUser = result.rows[0];
                if (!existingUser) {
                    res.status(404).json({ message: "User not found" });
                    return [2 /*return*/];
                }
                if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === (existingUser === null || existingUser === void 0 ? void 0 : existingUser.role)) {
                    res.status(403).json({ message: "Roles can not delete themselves" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.default.client.query("DELETE FROM users WHERE id = $1", [id])];
            case 3:
                _a.sent();
                res.status(200).json({ message: "User deleted successfully" });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;

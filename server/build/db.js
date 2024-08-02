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
var pg_1 = require("pg");
var dbConfig_1 = __importDefault(require("./dbConfig"));
var validation_1 = require("./utils/validation");
var auth_1 = require("./utils/auth");
var jwt_1 = require("./utils/jwt");
var initialUsers = [
    {
        name: "John",
        email: "john@example.com",
        password: "1234",
        role: validation_1.Role.ADMIN,
    },
    {
        name: "Jane",
        email: "jane@example.com",
        password: "1234",
        role: validation_1.Role.USER,
    },
];
var DB = /** @class */ (function () {
    function DB() {
    }
    DB.prototype.init = function () {
        return __awaiter(this, arguments, void 0, function (keys) {
            var poolConfig, users, err_1;
            if (keys === void 0) { keys = dbConfig_1.default; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!this.pool) {
                            poolConfig = {
                                user: keys.user,
                                host: keys.host,
                                database: keys.database,
                                password: keys.password,
                                port: keys.port,
                            };
                            this.pool = new pg_1.Pool(poolConfig);
                        }
                        return [4 /*yield*/, this.pool.query("CREATE TABLE IF NOT EXISTS users(\n\t\t\t\t\tid SERIAL PRIMARY KEY,\n\t\t\t\t\tname VARCHAR(255) NOT NULL,\n\t\t\t\t\temail VARCHAR(255) UNIQUE NOT NULL,\n\t\t\t\t\tpassword VARCHAR(255) NOT NULL,\n\t\t\t\t\trole VARCHAR(255) NOT NULL,\n\t\t\t\t\taccess_token VARCHAR(255) UNIQUE\n\t\t\t\t)")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.pool.query("\n\t\t\t\tSELECT * FROM users\n\t\t\t")];
                    case 2:
                        users = _a.sent();
                        if (!(users.rowCount === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.insertUsers()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.error("Failed to initialize db", err_1);
                        process.exit(1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DB.prototype.insertUsers = function () {
        return __awaiter(this, arguments, void 0, function (table) {
            var _i, initialUsers_1, user, hashedPassword, fieldsForToken, token, users, error_1;
            if (table === void 0) { table = "users"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.pool) {
                            throw new Error("Database pool is not initialized");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        _i = 0, initialUsers_1 = initialUsers;
                        _a.label = 2;
                    case 2:
                        if (!(_i < initialUsers_1.length)) return [3 /*break*/, 7];
                        user = initialUsers_1[_i];
                        return [4 /*yield*/, (0, auth_1.encrypt)(user.password)];
                    case 3:
                        hashedPassword = _a.sent();
                        fieldsForToken = {
                            email: user.email,
                            role: user.role,
                            name: user.name,
                        };
                        token = (0, jwt_1.generateToken)(JSON.stringify(fieldsForToken));
                        return [4 /*yield*/, this.pool.query("INSERT INTO ".concat(table, "(\n\t\t\t\t\t\tname, \n\t\t\t\t\t\temail,\n\t\t\t\t\t\tpassword,\n\t\t\t\t\t\trole,\n\t\t\t\t\t\taccess_token\n\t\t\t\t\t\t) VALUES($1, $2, $3, $4, $5)"), [user.name, user.email, hashedPassword, user.role, token])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.pool.query("\n\t\t\t\t\tSELECT * FROM users\n\t\t\t\t")];
                    case 5:
                        users = _a.sent();
                        console.log(users.rows);
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7:
                        console.log("All users inserted!");
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _a.sent();
                        console.log("Failed to insert users");
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(DB.prototype, "client", {
        get: function () {
            if (!this.pool) {
                throw new Error("Database pool is not initialized");
            }
            return this.pool;
        },
        enumerable: false,
        configurable: true
    });
    DB.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.pool) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.pool.end()];
                    case 2:
                        _a.sent();
                        console.log("Pool closed");
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.error("Failed to close pool", err_2);
                        process.exit(1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DB;
}());
var instance = new DB();
exports.default = instance;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.loginUserSchema = exports.createUserSchema = exports.UserSchema = exports.Role = void 0;
var zod_1 = require("zod");
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
})(Role || (exports.Role = Role = {}));
var RoleEnum = zod_1.z.nativeEnum(Role);
exports.UserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4),
    name: zod_1.z.string().min(1),
    role: RoleEnum.default(Role.USER),
    access_token: zod_1.z.string().optional(),
});
exports.createUserSchema = exports.UserSchema.omit({
    access_token: true,
});
exports.loginUserSchema = exports.UserSchema.pick({
    email: true,
    password: true,
});
exports.updateUserSchema = exports.UserSchema.partial().omit({
    access_token: true,
});

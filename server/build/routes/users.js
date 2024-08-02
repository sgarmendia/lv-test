"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var users_1 = require("../controllers/users");
var authenticate_1 = require("../middlewares/authenticate");
var authorize_1 = require("../middlewares/authorize");
var validation_1 = require("../utils/validation");
var router = express_1.default.Router();
// User Auth
router.post("/signup", users_1.userSignup);
router.post("/login", users_1.userLogin);
// User CRUD
router.get("/", authenticate_1.authenticate, (0, authorize_1.authorize)([validation_1.Role.ADMIN]), users_1.getUsers);
router.get("/:id", authenticate_1.authenticate, (0, authorize_1.authorize)([validation_1.Role.ADMIN, validation_1.Role.USER]), users_1.getUser);
router.put("/:id", authenticate_1.authenticate, (0, authorize_1.authorize)([validation_1.Role.ADMIN, validation_1.Role.USER]), users_1.updateUser);
router.delete("/:id", authenticate_1.authenticate, (0, authorize_1.authorize)([validation_1.Role.ADMIN]), users_1.deleteUser);
exports.default = (function (app) { return app.use("/users", router); });

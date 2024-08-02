import express, { Application } from "express";
import {
	getUsers,
	updateUser,
	deleteUser,
	userSignup,
	userLogin,
	getUser,
} from "../controllers/users";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { Role } from "../utils/validation";

const router = express.Router();

// User Auth
router.post("/signup", userSignup);
router.post("/login", userLogin);

// User CRUD
router.get("/", authenticate, authorize([Role.ADMIN]), getUsers);
router.get("/:id", authenticate, authorize([Role.ADMIN, Role.USER]), getUser);
router.put(
	"/:id",
	authenticate,
	authorize([Role.ADMIN, Role.USER]),
	updateUser
);
router.delete("/:id", authenticate, authorize([Role.ADMIN]), deleteUser);

export default (app: Application) => app.use("/users", router);

import { NextFunction, Response } from "express";
import { RequestWithUser, Role } from "../utils/validation";

export const authorize = (roles: Role[]) => {
	return (req: RequestWithUser, res: Response, next: NextFunction) => {
		try {
			const user = req.user;

			if (!user) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			if (!roles.includes(user.role)) {
				res.status(403).json({ error: "Forbidden" });
				return;
			}

			next();
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	};
};

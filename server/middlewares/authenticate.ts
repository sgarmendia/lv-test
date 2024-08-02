import { NextFunction, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { RequestWithUser } from "../utils/validation";

export const authenticate = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			res.status(401).json({ status: "error", message: "No token in headers" });
			return;
		}

		const data = verifyToken(token);

		req.user = data;
		next();
	} catch (error) {
		if (error instanceof Error) {
			res.status(401).json({ status: "error", message: error.message });
			return;
		}
		next(error);
	}
};

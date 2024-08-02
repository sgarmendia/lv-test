import { Request, Response, ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (
	err: Error,
	_req: Request,
	res: Response
) => {
	console.error(err.message);
	res
		.status(500)
		.json({ message: "Internal Server Error", error: err.message });
};

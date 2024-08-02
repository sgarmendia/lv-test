import { sign, verify } from "jsonwebtoken";
import { SessionUser } from "./validation";
const JWT_SECRET = process.env.JWT_SECRET || "secret1234567890";

const generateToken = (data: string) => {
	const jwt = sign({ data }, JWT_SECRET, {
		expiresIn: "1d",
	});
	return jwt;
};

const verifyToken = (jwt: string): SessionUser => {
	const { data } = verify(jwt, JWT_SECRET) as { data: string };
	return JSON.parse(data);
};

export { generateToken, verifyToken };

import { Response, NextFunction } from "express";

import {
	createUserSchema,
	loginUserSchema,
	RequestWithUser,
	Role,
	updateUserSchema,
} from "../utils/validation";
import db from "../db";
import { encrypt, verify } from "../utils/auth";
import { generateToken } from "../utils/jwt";

export const userSignup = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const { email, password, name, role } = req.body;

	try {
		const validateUser = createUserSchema.safeParse({
			email,
			password,
			name,
			role,
		});

		if (!validateUser.success) {
			next(validateUser.error.message);
			return;
		}

		const checkUser = await db.client.query(
			"SELECT * FROM users WHERE email = $1",
			[email]
		);

		if (checkUser.rows[0]) {
			res.status(409).send({ status: "error", message: "User already exists" });
			return;
		}

		const hashedPassword = await encrypt(password);
		const token = generateToken(JSON.stringify({ email, role, name }));

		const registeredNewUser = await db.client.query(
			"INSERT INTO users (name, email, password, role, access_token) VALUES ($1, $2, $3, $4, $5) RETURNING *",
			[name, email, hashedPassword, role, token]
		);

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
	} catch (error) {
		next(error);
	}
};

export const userLogin = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;

	try {
		const validateUser = loginUserSchema.safeParse({ email, password });

		if (!validateUser.success) {
			next(validateUser.error.message);
			return;
		}

		const userData = await db.client.query(
			"SELECT * FROM users WHERE email = $1",
			[email]
		);

		const user = userData.rows[0];
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		const isPasswordValid = await verify(password, user.password);

		if (!isPasswordValid) {
			res
				.status(401)
				.json({ status: "error", message: "Invalid email or password" });
			return;
		}

		const token = generateToken(
			JSON.stringify({ email: user.email, role: user.role, name: user.name })
		);

		res.status(200).json({ token });
	} catch (error) {
		next(error);
	}
};

export const getUsers = async (
	_req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await db.client.query("SELECT * FROM users");

		res.json(result.rows);
	} catch (error) {
		next(error);
	}
};

export const getUser = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.id;
	const currentUser = req.user;
	const isUser = currentUser?.role === Role.USER;

	try {
		const result = await db.client.query("SELECT * FROM users WHERE id = $1", [
			id,
		]);
		const user = result.rows[0];
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		if (isUser && currentUser?.email !== user.email) {
			res.status(403).json({ message: "A user can only get his own data." });
			return;
		}

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const updateUser = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.id;
	const { name, email, password, role } = req.body;
	const currentUser = req.user;

	const isUser = currentUser?.role === Role.USER;

	if (isUser && role !== undefined) {
		res.status(403).json({ message: "A User can not change its own Role" });
		return;
	}

	try {
		const validateUser = updateUserSchema.safeParse({
			name,
			email,
			password,
			role,
		});

		if (!validateUser.success) {
			res.status(400).json({ message: validateUser.error.message });
			return;
		}

		const result = await db.client.query("SELECT * FROM users WHERE id = $1", [
			id,
		]);

		const existingUser = result.rows[0];

		console.log({ existingUser });

		if (!existingUser) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		if (isUser && currentUser?.email !== existingUser.email) {
			res.status(403).json({ message: "A user can only update his own data." });
			return;
		}

		const updatedEmail = email ?? existingUser.email;
		const updatedPassword = password
			? await encrypt(password)
			: existingUser.password;
		const updatedName = name ?? existingUser.name;
		const updatedRole = role ?? existingUser.role;

		const token = generateToken(
			JSON.stringify({
				email: updatedEmail,
				role: updatedRole,
				name: updatedName,
			})
		);

		const dataToUpdate = [
			updatedEmail,
			updatedPassword,
			updatedName,
			updatedRole,
			token,
			id,
		];

		const updatedUserResult = await db.client.query(
			"UPDATE users SET email = $1, password = $2, name = $3, role = $4, access_token = $5 WHERE id = $6 RETURNING *",
			dataToUpdate
		);

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
	} catch (error) {
		next(error);
	}
};

export const deleteUser = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.id;
	const currentUser = req.user;

	try {
		const result = await db.client.query("SELECT * FROM users WHERE id = $1", [
			id,
		]);

		const existingUser = result.rows[0];

		if (!existingUser) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		if (currentUser?.role === existingUser?.role) {
			res.status(403).json({ message: "Roles can not delete themselves" });
			return;
		}

		await db.client.query("DELETE FROM users WHERE id = $1", [id]);
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		next(error);
	}
};

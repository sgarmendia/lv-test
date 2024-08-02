import { Request } from "express";
import { z } from "zod";

export enum Role {
	ADMIN = "ADMIN",
	USER = "USER",
}

const RoleEnum = z.nativeEnum(Role);

export const UserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
	name: z.string().min(1),
	role: RoleEnum.default(Role.USER),
	access_token: z.string().optional(),
});

export const createUserSchema = UserSchema.omit({
	access_token: true,
});

export const loginUserSchema = UserSchema.pick({
	email: true,
	password: true,
});

export const updateUserSchema = UserSchema.partial().omit({
	access_token: true,
});

export type User = z.infer<typeof UserSchema>;

export type LoginUser = z.infer<typeof loginUserSchema>;

export type SessionUser = Omit<User, "password" | "access_token">;

export interface RequestWithUser extends Request {
	user?: SessionUser;
}

import request from "supertest";
import app from "../app";
import db from "../db";

import { LoginUser } from "../utils/validation";
import { JwtPayload } from "jsonwebtoken";

const loginUserAndGetToken = async (userData: LoginUser) => {
	const response = await request(app).post("/users/login").send(userData);
	return response.body.token;
};

describe("User Routes", () => {
	beforeAll(async () => {
		await db.init();

		await db.client.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
	});

	afterAll(async () => {
		await db.close();
	});

	describe("USER", () => {
		let token: JwtPayload;

		beforeAll(async () => {
			// Get token for preseeded USER
			const userData = {
				email: "jane@example.com",
				password: "1234",
			};

			token = await loginUserAndGetToken(userData);
		});

		it("Should not GET users", (done) => {
			request(app)
				.get("/users")
				.set("Authorization", `Bearer ${token}`)
				.end((_err, res) => {
					expect(res.statusCode).toEqual(403);
					done();
				});
		});

		it("Should GET user with id=2", (done) => {
			request(app)
				.get("/users/2")
				.set("Authorization", `Bearer ${token}`)
				.end((_err, res) => {
					expect(res.statusCode).toEqual(200);
					done();
				});
		});

		it("Should not be able to DELETE user with id=1", (done) => {
			request(app)
				.delete("/users/1")
				.set("Authorization", `Bearer ${token}`)
				.end((_err, res) => {
					expect(res.statusCode).toEqual(403);
					done();
				});
		});
	});

	describe("ADMIN", () => {
		let token: JwtPayload;

		beforeAll(async () => {
			// Get token for preseeded ADMIN user
			const userData = {
				email: "john@example.com",
				password: "1234",
			};
			token = await loginUserAndGetToken(userData);
		});

		it("Should GET users", (done) => {
			request(app)
				.get("/users")
				.set("Authorization", `Bearer ${token}`)
				.end((_err, res) => {
					expect(res.statusCode).toEqual(200);
					expect(res.body).toBeInstanceOf(Array);
					done();
				});
		});

		it("Should GET user with id=2", (done) => {
			// 2 is id of preseeded USER
			request(app)
				.get("/users/2")
				.set("Authorization", `Bearer ${token}`)
				.end((_err, res) => {
					expect(res.statusCode).toEqual(200);
					done();
				});
		});

		it("Should be able to DELETE user with id=2", (done) => {
			request(app)
				.delete("/users/2")
				.set("Authorization", `Bearer ${token}`)
				.end((_err, res) => {
					expect(res.statusCode).toEqual(200);
					done();
				});
		});
	});
});

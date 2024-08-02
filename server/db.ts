"use strict";

import { ClientConfig, Pool, PoolConfig } from "pg";
import defaultKeys from "./dbConfig";
import { User, Role } from "./utils/validation";
import { encrypt } from "./utils/auth";
import { generateToken } from "./utils/jwt";

const initialUsers: User[] = [
	{
		name: "John",
		email: "john@example.com",
		password: "1234",
		role: Role.ADMIN,
	},
	{
		name: "Jane",
		email: "jane@example.com",
		password: "1234",
		role: Role.USER,
	},
];

class DB {
	private pool: Pool | undefined;

	async init(keys: ClientConfig = defaultKeys): Promise<void> {
		try {
			if (!this.pool) {
				const poolConfig: PoolConfig = {
					user: keys.user,
					host: keys.host,
					database: keys.database,
					password: keys.password,
					port: keys.port,
				};
				this.pool = new Pool(poolConfig);
			}

			await this.pool.query(
				`CREATE TABLE IF NOT EXISTS users(
					id SERIAL PRIMARY KEY,
					name VARCHAR(255) NOT NULL,
					email VARCHAR(255) UNIQUE NOT NULL,
					password VARCHAR(255) NOT NULL,
					role VARCHAR(255) NOT NULL,
					access_token VARCHAR(255) UNIQUE
				)`
			);

			const users = await this.pool.query(`
				SELECT * FROM users
			`);

			if (users.rowCount === 0) {
				await this.insertUsers();
			}
		} catch (err) {
			console.error("Failed to initialize db", err);
			process.exit(1);
		}
	}

	private async insertUsers(table = "users"): Promise<void> {
		if (!this.pool) {
			throw new Error("Database pool is not initialized");
		}

		try {
			for (let user of initialUsers) {
				const hashedPassword = await encrypt(user.password);
				const fieldsForToken = {
					email: user.email,
					role: user.role,
					name: user.name,
				};
				const token = generateToken(JSON.stringify(fieldsForToken));
				await this.pool.query(
					`INSERT INTO ${table}(
						name, 
						email,
						password,
						role,
						access_token
						) VALUES($1, $2, $3, $4, $5)`,
					[user.name, user.email, hashedPassword, user.role, token]
				);

				const users = await this.pool.query(`
					SELECT * FROM users
				`);
				console.log(users.rows);
			}

			console.log("All users inserted!");
		} catch (error) {
			console.log("Failed to insert users");
		}
	}

	get client(): Pool {
		if (!this.pool) {
			throw new Error("Database pool is not initialized");
		}
		return this.pool;
	}

	async close(): Promise<void> {
		if (this.pool) {
			try {
				await this.pool.end();
				console.log("Pool closed");
			} catch (err) {
				console.error("Failed to close pool", err);
				process.exit(1);
			}
		}
	}
}

const instance = new DB();

export default instance;

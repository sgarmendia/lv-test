# leovegas-test

The test is fully Dockerized so in order to try it please run:

```
docker-compose build
docker-compose up
```

The server will be available at http://localhost:5000

## Usage

The nodejs server waits for the Postgres db to be ready.

The db is initialized with the following data in a _users_ table:

```typescript
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
```

Once the docker containers are ready the following endpoints would be available:

#### GET

**users/** -> return all users (only for ADMIN role)

**users/:id** -> return a single user (for USER only its own)

#### PUT

**users/:id** -> update an existing user (for USER only its own)

#### DELETE

**users/:id** -> delete user with _id_ (only ADMIN)

## Test

In order to run the test with **Jest**, run

```
npm run test
```

## Aditional notes

The test does not work.

Originally my idea was to run the test with the PostgresDB container running, but some problems arose and the test were not able to connect. I need more time to solve this issue.

Or I could have mocked the DB locally.

Both the server and the DB are setup in a docker-compose.yml file.
The DB used is PostgreSQL.

A logging middleware could have been used but docker-compose provides good logging for the containers.

---

Made with love in BCN by _Simon Garmendia_

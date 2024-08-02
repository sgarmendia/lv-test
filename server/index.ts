import server from "./app";
import db from "./db";

db.init().then(() => {
	console.log("Database initialized");
	process.once("SIGTERM", () => db.close()).once("SIGINT", () => db.close());
});

server.listen(5000, () => {
	console.log("Server listening on port 5000");
});

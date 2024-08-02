import express from "express";
const app = express();

import userRoutes from "./routes/users";
import { errorMiddleware } from "./middlewares/errorHandling";

app.use(express.json());

userRoutes(app);

app.use(errorMiddleware);

export default app;

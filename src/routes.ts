import { type Express } from "express";
import userRouter from "./routes/users.route";

import { ErrorHandler } from "./controllers/error.controller";
import authRouter from "./routes/auth.route";
export function routes(app: Express) {
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use(ErrorHandler);
}

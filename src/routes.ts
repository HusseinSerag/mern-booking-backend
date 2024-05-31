import { type Express } from "express";
import userRouter from "./routes/users.route";

import { ErrorHandler } from "./controllers/error.controller";

export function routes(app: Express) {
  app.use("/api/users", userRouter);

  app.use(ErrorHandler);
}

import { type Express } from "express";
import userRouter from "./routes/users.route";
export function routes(app: Express) {
  app.use("/auth", userRouter);
}

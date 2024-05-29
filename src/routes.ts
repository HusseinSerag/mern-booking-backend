import { type Express } from "express";
import userRouter from "./routes/users.route";
import { validate } from "./middleware/validateResource";
import { userZodSchema } from "./schema/user.schema";
import { ErrorHandler } from "./controllers/error.controller";
export function routes(app: Express) {
  app.use("/auth", validate(userZodSchema), userRouter);
  app.use(ErrorHandler);
}

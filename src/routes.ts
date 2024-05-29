import { type Express } from "express";
import userRouter from "./routes/users.route";
import { validate } from "./middleware/validateResource";
import { userZodSchema } from "./schema/user.schema";
export function routes(app: Express) {
  app.use("/auth", validate(userZodSchema), userRouter);
}

import { Router } from "express";
import { registerUserHandler } from "../controllers/user.controller";
import { validate } from "../middleware/validateResource";
import { userZodSchema } from "../schema/user.schema";
const router = Router();

router.post("/register", validate(userZodSchema), registerUserHandler);

export default router;

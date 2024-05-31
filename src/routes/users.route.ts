import { Router } from "express";
import { registerUserHandler } from "../controllers/user.controller";
import { validate } from "../middleware/validateResource";
import { userZodSchema } from "../schema/user.schema";

import { loginSchema } from "../schema/auth.schema";
import {
  getCurrentUserHandler,
  loginUserHandler,
  logoutHandler,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/register", validate(userZodSchema), registerUserHandler);
router.post("/login", validate(loginSchema), loginUserHandler);
router.post("/logout", verifyToken, logoutHandler);
router.get("/user", verifyToken, getCurrentUserHandler);

export default router;

import { Router } from "express";
import { registerUserHandler } from "../controllers/user.controller";
import { validate } from "../middleware/validateResource";
import { userZodSchema } from "../schema/user.schema";
import jwt from "jsonwebtoken";
import {
  confirmEmailHandler,
  getCurrentUserHandler,
  loginUserHandler,
  logoutHandler,
  requestConfirmEmailHandler,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";
import { loginSchema } from "../schema/auth.schema";
const router = Router();

router.post("/register", validate(userZodSchema), registerUserHandler);
router.post("/logout", logoutHandler);
router.post("/login", validate(loginSchema), loginUserHandler);
router.get("/user", verifyToken, getCurrentUserHandler);
router.post("/request-confirm-email", verifyToken, requestConfirmEmailHandler);
router.patch("/confirm-email/:token", confirmEmailHandler);

export default router;

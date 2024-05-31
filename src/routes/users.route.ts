import { Router } from "express";
import { registerUserHandler } from "../controllers/user.controller";
import { validate } from "../middleware/validateResource";
import { userZodSchema } from "../schema/user.schema";

import { loginSchema } from "../schema/auth.schema";
import { loginUserHandler } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/register", validate(userZodSchema), registerUserHandler);
router.post("/login", validate(loginSchema), loginUserHandler);
router.get("/", verifyToken, (req, res) => {
  return res.status(200).json({
    user: 1,
  });
});

export default router;

import express from "express";
import { validate } from "../middleware/validateResource";
import { loginSchema } from "../schema/auth.schema";
import { loginUserHandler } from "../controllers/auth.controller";
const router = express.Router();

router.post("/login", validate(loginSchema), loginUserHandler);

export default router;

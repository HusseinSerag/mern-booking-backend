import { Router } from "express";
import { registerUserHandler } from "../controllers/user.controller";
const router = Router();

router.post("/register", registerUserHandler);

export default router;

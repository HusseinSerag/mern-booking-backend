import { Router } from "express";
import { registerUserHandler } from "../controllers/user.controller";
import { validate } from "../middleware/validateResource";
import { userZodSchema } from "../schema/user.schema";
import jwt from "jsonwebtoken";
const router = Router();

router.post("/register", validate(userZodSchema), registerUserHandler);
router.route("/").get((req, res) => {
  console.log(req.headers);
  const decodedPayload = jwt.verify;

  return res.status(200).json({
    user: 1,
  });
});

export default router;

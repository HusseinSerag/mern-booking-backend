import { type Request, type Response, type NextFunction } from "express";
import { LoginType } from "../schema/auth.schema";
import { log } from "../utils/logger";

export async function loginUserHandler(
  req: Request<{}, {}, LoginType["body"]>,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  try {
  } catch (e) {
    log.error(e);
    next(e);
  }
}

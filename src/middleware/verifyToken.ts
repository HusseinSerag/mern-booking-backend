import { type Response, type NextFunction, Request } from "express";
import { type RequestI } from "../types";
import { log } from "../utils/logger";
import { AppError } from "../utils/customError";
import { verify } from "../utils/jwt";
import { findUserById } from "../services/user.service";
export async function verifyToken(
  req: RequestI,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies["auth_token"];
    log.info(token);
    if (!token) {
      throw new AppError("Unauthorized , please log in!");
    }
    const { iat, userId } = verify(token);
    const user = await findUserById(userId);
    if (user.checkIfTokenIsNew(iat!)) {
      throw new AppError("Please log in again!");
    }
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
}

import { type Response, type NextFunction, Request } from "express";
import { type RequestI } from "../types";
import { log } from "../utils/logger";
import { AppError } from "../utils/customError";
import { verify } from "../utils/jwt";
export function verifyToken(req: RequestI, res: Response, next: NextFunction) {
  try {
    const token = req.cookies["auth_token"];

    if (!token) {
      throw new AppError("Unauthorized , please log in!");
    }
    const decodedURL = verify(token);
    log.info(decodedURL);

    next();
  } catch (e) {
    next(e);
  }
}

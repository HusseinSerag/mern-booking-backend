import { type Request, type Response, type NextFunction } from "express";
import { LoginType } from "../schema/auth.schema";
import { log } from "../utils/logger";
import {
  findUser,
  ifUserDoesNotExist,
  UserDoc,
} from "../services/user.service";
import { UserDocument } from "../models/user.model";
import { Document } from "mongoose";
import { AppError } from "../utils/customError";

export async function loginUserHandler(
  req: Request<{}, {}, LoginType["body"]>,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  try {
    const user = await findUser<UserDoc>(email, ifUserDoesNotExist);

    const isMatch = await user.comparePasswords(password);
    if (!isMatch) {
      throw new AppError("Password is incorrect");
    }
    res.sendStatus(200);
  } catch (e) {
    log.error(e);
    next(e);
  }
}

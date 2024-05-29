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
import { sign } from "../utils/jwt";

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

    const token = sign(
      { userId: user._id },
      {
        expiresIn: "1d",
      }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });
    res.status(200).json({ userId: user._id });
  } catch (e) {
    log.error(e);
    next(e);
  }
}

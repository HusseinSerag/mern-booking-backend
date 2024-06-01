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
import { RequestI } from "../types";
import { omit } from "lodash";
import { sendEmail } from "../utils/email";

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

export async function getCurrentUserHandler(
  req: RequestI,
  res: Response,
  next: NextFunction
) {
  res.status(200).json({
    user: omit(req.user!.toObject(), ["password"]),
  });
}
export async function requestConfirmEmailHandler(
  req: RequestI,
  res: Response,
  next: NextFunction
) {
  const user = req.user!;
  const email = user.email;

  try {
    const token = user.createRequestEmailConfirmationToken();

    res.status(200).json({
      message: "successful",
      token,
    });

    await sendEmail({
      subject: "Confirm Email",
      email: email,
      html: `Hello ${user.firstName}! Please confirm your mail by clicking on this <a href="${process.env.FRONTEND_URL}/verify/${token}" target="_blank"> link </a>`,
    });
    await user.save();
  } catch (e) {
    next(e);
  }
}

export async function logoutHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "User logged out successfully!",
  });
}

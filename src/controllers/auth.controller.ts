import { type Request, type Response, type NextFunction } from "express";
import { ConfirmMailType, LoginType } from "../schema/auth.schema";
import { log } from "../utils/logger";
import {
  findUser,
  findUserByConfirmEmailToken,
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
import encrypt from "../utils/encrypt";

export async function loginUserHandler(
  req: Request<{}, {}, LoginType["body"]>,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  try {
    const user = await findUser<UserDoc>(email, ifUserDoesNotExist);
    if (user.loginLocked && new Date(user.loginLocked).getTime() > Date.now()) {
      user.numberOfLogins = 0;
      await user.save();
      throw new AppError("Please login later!");
    }
    const isMatch = await user.comparePasswords(password);
    if (!isMatch) {
      user.numberOfLogins = user.numberOfLogins + 1;
      await user.save();
      if (user.numberOfLogins >= 5) {
        user.loginLocked = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();
        throw new AppError(
          "You tried logging in too much , please try again later!"
        );
      }
      throw new AppError("Password is incorrect!");
    }

    const token = sign(
      { userId: user._id },
      {
        expiresIn: "1d",
      }
    );
    user.numberOfLogins = 0;
    user.loginLocked = null;
    await user.save();
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

export async function confirmEmailHandler(
  req: Request<ConfirmMailType["params"]>,
  res: Response,
  next: NextFunction
) {
  const { token } = req.params;
  try {
    const user = await findUserByConfirmEmailToken(encrypt(token));

    user.emailConfirmationToken = "";
    user.emailConfirmationExpireTime = null;
    user.isEmailConfirmed = true;
    user.emailConfirmedAt = new Date(Date.now());

    await user.save();
    const authToken = sign(
      { userId: user._id },
      {
        expiresIn: "1d",
      }
    );
    res.cookie("auth_token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });
    res.status(200).json({ message: "success" });
  } catch (e) {
    next(e);
  }
}

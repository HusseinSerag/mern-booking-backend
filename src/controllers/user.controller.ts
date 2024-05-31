import { type Request, type Response, type NextFunction } from "express";
import { UserType } from "../schema/user.schema";
import { createUser, findUser, ifUserExist } from "../services/user.service";
import { log } from "../utils/logger";
import { omit } from "lodash";
import { sign } from "../utils/jwt";

export async function registerUserHandler(
  req: Request<{}, {}, UserType["body"]>,
  res: Response,
  next: NextFunction
) {
  const { email, firstName, lastName, password } = req.body;
  try {
    await findUser<null>(email, ifUserExist);

    const user = await createUser(email, firstName, password, lastName);
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

    return res.status(200).json({
      message: "Account successfully created!",
    });
  } catch (e: any) {
    log.error(e);
    return next(e);
  }
}

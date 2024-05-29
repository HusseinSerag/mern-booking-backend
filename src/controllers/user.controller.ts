import { type Request, type Response, type NextFunction } from "express";
import { UserType } from "../schema/user.schema";
import { createUser, findIfUserExist } from "../services/user.service";
import { log } from "../utils/logger";
export async function registerUserHandler(
  req: Request<{}, {}, UserType["body"]>,
  res: Response,
  next: NextFunction
) {
  const { email, firstName, lastName, password } = req.body;
  try {
    await findIfUserExist(email);
    const user = await createUser(email, firstName, password, lastName);
    return res.status(201).json({
      data: {
        user,
      },
    });
  } catch (e: any) {
    log.error(e);
    return next(e);
  }
}

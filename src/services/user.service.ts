import { Document } from "mongoose";
import { User, UserDocument } from "../models/user.model";
import { AppError } from "../utils/customError";

export async function findUser(email: string, fn: (...args: any[]) => any) {
  const user = await User.findOne({ email });
  return fn(user);
}

export function ifUserExist(user: Document<unknown, {}, UserDocument> | null) {
  if (user) {
    throw new AppError("User already exists!");
  }
}
export async function createUser(
  email: string,
  firstName: string,
  password: string,
  lastName: string
) {
  try {
    const user = await User.create({
      email,
      firstName,
      password,
      lastName,
    });
    return user;
  } catch (e) {
    throw e;
  }
}

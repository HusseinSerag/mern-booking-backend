import { Document } from "mongoose";
import { User, UserDocument } from "../models/user.model";
import { AppError } from "../utils/customError";
export type UserDoc = Document<unknown, {}, UserDocument> &
  UserDocument &
  Required<{
    _id: string;
  }>;
export async function findUser<T>(
  email: string,
  fn: (...args: any[]) => Promise<T>
) {
  const user = await User.findOne({ email });
  return fn(user);
}

export function ifUserExist(user: UserDoc | null) {
  if (user) {
    throw new AppError("User already exists!");
  }
  return Promise.resolve(null);
}
export async function ifUserDoesNotExist(user: UserDoc | null) {
  if (!user) {
    throw new AppError("User doesn't exist!");
  }
  return user;
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

export async function findUserById(id: string) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (e) {
    throw e;
  }
}

import { User } from "../models/user.model";
import { AppError } from "../utils/customError";

export async function findIfUserExist(email: string) {
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new AppError("User already exist!");
    }
  } catch (e) {
    throw e;
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

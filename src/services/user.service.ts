import { User } from "../models/user.model";

export async function findIfUserExist(email: string) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User doesn't exist!");
    }
  } catch (e) {
    throw e;
  }
}

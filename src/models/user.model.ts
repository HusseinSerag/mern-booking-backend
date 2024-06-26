import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AppError } from "../utils/customError";
import encrypt from "../utils/encrypt";

export interface UserDocument {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailConfirmed: boolean;
  emailConfirmationToken: string;
  emailConfirmationExpireTime: Date | null;
  emailConfirmedAt: Date | null;
  comparePasswords(pass: string): Promise<boolean>;
  createRequestEmailConfirmationToken(): string;
  checkIfTokenIsNew(time: number): boolean;
  loginLocked: Date | null;
  numberOfLogins: number;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
    emailConfirmationToken: String,
    emailConfirmationExpireTime: Date,
    emailConfirmedAt: Date,
    numberOfLogins: {
      type: Number,
      default: 0,
    },
    loginLocked: Date,
  },
  {
    timestamps: true,
    methods: {
      comparePasswords(incomingPassword: string) {
        return bcrypt.compare(incomingPassword, this.password);
      },
      checkIfTokenIsNew(time: number) {
        if (this.emailConfirmedAt) {
          const changedTime = parseInt(
            (this.emailConfirmedAt.getTime() / 1000).toString(),
            10
          );

          return time < changedTime;
        }

        return false;
      },
      createRequestEmailConfirmationToken() {
        try {
          if (this.isEmailConfirmed) {
            throw new AppError("Email is already confirmed!");
          }
          if (
            this.emailConfirmationExpireTime &&
            this.emailConfirmationExpireTime.getTime() > Date.now()
          ) {
            throw new AppError("Cannot issue another token!");
          }

          const token = crypto.randomBytes(32).toString("hex");

          this.emailConfirmationToken = encrypt(token);
          this.emailConfirmationExpireTime = new Date(Date.now() + 3600000);

          return token;
        } catch (e) {
          throw e;
        }
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }
  user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(8));
  next();
});
export const User = mongoose.model<UserDocument>("User", userSchema);

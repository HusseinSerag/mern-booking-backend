import mongoose from "mongoose";
import bcrypt from "bcryptjs";
export interface UserDocument {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  comparePasswords(pass: string): Promise<boolean>;
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
  },
  {
    timestamps: true,
    methods: {
      comparePasswords(incomingPassword: string) {
        return bcrypt.compare(incomingPassword, this.password);
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

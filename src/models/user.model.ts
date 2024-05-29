import mongoose from "mongoose";
export interface UserDocument {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
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
  }
);

export const User = mongoose.model<UserDocument>("User", userSchema);

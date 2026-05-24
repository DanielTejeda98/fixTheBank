import mongoose from "mongoose";

export interface User extends mongoose.Document {
  username: string;
  password: string;
  email: string;
  disabled: boolean;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: Date;
}

const UserSchema = new mongoose.Schema<User>({
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpiry: {
    type: Date,
  },
});

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);

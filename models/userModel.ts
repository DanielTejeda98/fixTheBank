import mongoose from "mongoose";

export interface User extends mongoose.Document {
  username: string;
  password: string;
  email: string;
  disabled: boolean;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: Date;
  budgetConfigurations: {
    budgetId: mongoose.Types.ObjectId;
    pinnedTemplates: mongoose.Types.ObjectId[];
  }[];
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
  budgetConfigurations: [
    {
      budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget",
      },
      pinnedTemplates: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Template",
        },
      ],
    },
  ],
});

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);

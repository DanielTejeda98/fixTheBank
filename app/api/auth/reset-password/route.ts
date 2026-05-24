import dbConnect from "@/app/lib/dbConnect";
import { hash } from "@/app/lib/passwordHasher";
import userModel from "@/models/userModel";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { token, newPassword, confirmNewPassword } = await req.json();

  if (!token || !newPassword || !confirmNewPassword) {
    return new Response(
      JSON.stringify({ success: false, error: "All fields are required" }),
      { status: 400 },
    );
  }

  await dbConnect();

  const user = await userModel.findOne({
    passwordResetToken: token,
    passwordResetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid or expired reset token",
      }),
      { status: 400 },
    );
  }

  if (newPassword !== confirmNewPassword) {
    return new Response(
      JSON.stringify({ success: false, error: "Passwords do not match" }),
      { status: 400 },
    );
  }

  user.password = await hash(newPassword);
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiry = undefined;
  await user.save();

  return new Response(
    JSON.stringify({
      success: true,
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    }),
    { status: 200 },
  );
}

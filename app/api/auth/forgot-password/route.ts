import dbConnect from "@/app/lib/dbConnect";
import userModel from "@/models/userModel";
import smtp2goClient from "@/providers/SMTP2GO";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return new Response(
      JSON.stringify({ success: false, error: "Email is required" }),
      { status: 400 },
    );
  }

  await dbConnect();

  const user = await userModel.findOne({ email });

  if (
    user &&
    !user.disabled &&
    user.passwordResetTokenExpiry &&
    user.passwordResetTokenExpiry < new Date()
  ) {
    // Generate a password reset token and expiry
    const token = Buffer.from(
      crypto.getRandomValues(new Uint8Array(32)),
    ).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Save the token and expiry to the user document
    await userModel.findByIdAndUpdate(user._id, {
      passwordResetToken: token,
      passwordResetTokenExpiry: expiry,
    });

    smtp2goClient.sendEmail({
      sender: `${process.env.DEFAULT_FROM_NAME} <${process.env.DEFAULT_FROM_ADDRESS}>`,
      to: user.email,
      subject: "Password Reset Request",
      template_id: "1041248",
      template_data: {
        reset_url: `${process.env.NEXT_PUBLIC_FTB_HOST}/auth/reset-password?token=${token}`,
      },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    }),
    { status: 200 },
  );
}

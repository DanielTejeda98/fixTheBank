import dbConnect from "@/app/lib/dbConnect";
import userModel from "@/models/userModel";
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

  if (user) {
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

    // Send email with reset instructions (this is a placeholder - implement your email sending logic here)
    console.log(`Send password reset email to ${email} with token: ${token}`);
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

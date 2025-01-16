import { NextResponse } from "next/server";
import crypto from "crypto-js";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";
import { sendResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ message: "If an account exists, a reset link has been sent" });
    }

    // Generate reset token
    const resetToken = crypto.lib.WordArray.random(32).toString();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save hashed token
    user.resetToken = crypto.SHA256(resetToken).toString();
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    await sendResetEmail(user.email, resetToken);

    return NextResponse.json({ message: "If an account exists, a reset link has been sent" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { token, password } = await request.json();
    await dbConnect();

    // Find user with valid reset token
    const hashedToken = crypto.SHA256(token).toString();
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
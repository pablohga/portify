import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check email" },
      { status: 500 }
    );
  }
}
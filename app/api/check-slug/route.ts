import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verifica se o slug já está em uso
    const isSlugTaken = await User.findOne({ slug });

    return NextResponse.json({ available: !isSlugTaken });
  } catch (error) {
    console.error("Error checking slug availability:", error);
    return NextResponse.json(
      { error: "Failed to check slug availability" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Home } from "@/models/home";
import { authOptions } from "@/lib/auth-options";
import { isAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const home = await Home.findOne().sort({ createdAt: -1 });
    return NextResponse.json(home || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch home data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    
    // Delete previous home data
    await Home.deleteMany({ userId: session.user.id });
    
    // Create new home data
    const home = await Home.create({
      ...data,
      userId: session.user.id,
    });
    
    return NextResponse.json(home);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update home data" }, { status: 500 });
  }
}
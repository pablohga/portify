import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { About } from "@/models/about";
import { authOptions } from "@/lib/auth-options";
/* import { authOptions } from "@/lib/auth-options"; */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    await dbConnect();
    const about = await About.findOne(userId ? { userId } : {}).sort({ createdAt: -1 });
    return NextResponse.json(about || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    
    // Delete previous about data for this user
    await About.deleteMany({ userId: session.user.id });
    
    // Create new about data
    const about = await About.create({
      ...data,
      userId: session.user.id,
    });
    
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update about data" }, { status: 500 });
  }
}
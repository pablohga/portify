import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Notification } from "@/models/notification";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const notifications = await Notification.find({ 
      userId: session.user.id 
    }).sort({ createdAt: -1 });

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
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
    
    const notification = await Notification.create({
      ...data,
      userId: session.user.id,
    });
    
    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      emailNotifications: user.emailNotifications || false,
      paymentReminders: user.paymentReminders || false,
      reportAlerts: user.reportAlerts || false,
      revenueThreshold: user.revenueThreshold || 1000,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notification settings" },
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
    
    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        emailNotifications: data.emailNotifications,
        paymentReminders: data.paymentReminders,
        reportAlerts: data.reportAlerts,
        revenueThreshold: data.revenueThreshold,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      emailNotifications: user.emailNotifications,
      paymentReminders: user.paymentReminders,
      reportAlerts: user.reportAlerts,
      revenueThreshold: user.revenueThreshold,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update notification settings" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { ContactSettings } from "@/models/contact";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    await dbConnect();
    const settings = await ContactSettings.findOne().sort({ createdAt: -1 });
    
    // Remove sensitive information before sending to client
    const safeSettings = settings ? {
      _id: settings._id,
      emailTo: settings.emailTo,
      emailService: settings.emailService,
      hasSmtpSettings: !!settings.smtpSettings?.host,
      hasResendApiKey: !!settings.resendApiKey,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    } : null;
    
    return NextResponse.json(safeSettings || {});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contact settings" },
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
    
    // Delete previous settings
    await ContactSettings.deleteMany({});
    
    // Create new settings
    const settings = await ContactSettings.create({
      ...data,
      userId: session.user.id,
    });
    
    // Remove sensitive information before sending response
    const safeSettings = {
      _id: settings._id,
      emailTo: settings.emailTo,
      emailService: settings.emailService,
      hasSmtpSettings: !!settings.smtpSettings?.host,
      hasResendApiKey: !!settings.resendApiKey,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
    
    return NextResponse.json(safeSettings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update contact settings" },
      { status: 500 }
    );
  }
}
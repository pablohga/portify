import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ContactSettings } from "@/models/contact";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    await dbConnect();
    const settings = await ContactSettings.findOne(userId ? { userId } : {}).sort({ createdAt: -1 });
    return NextResponse.json({ 
      _id: settings?._id,
      imageUrl: settings?.imageUrl 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contact image" },
      { status: 500 }
    );
  }
}
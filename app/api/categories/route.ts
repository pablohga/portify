import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Category } from "@/models/category";
import { authOptions } from "@/lib/auth-options";
import { checkSubscriptionLimits } from "@/lib/subscription";
import { User } from "@/models/user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    await dbConnect();
    const categories = await Category.find(userId ? { userId } : {}).sort({ order: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    
    // Get user's subscription tier
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check subscription limits
    await checkSubscriptionLimits(session.user.id, user.subscriptionTier);

    const data = await request.json();
    
    // Create a URL-friendly ID from the name
    const id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check if category with same name already exists for this user
    const existingCategory = await Category.findOne({
      userId: session.user.id,
      name: data.name
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }
    
    const category = await Category.create({
      ...data,
      id,
      userId: session.user.id,
    });
    
    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";
import { authOptions } from "@/lib/auth-options";
import { isAdmin } from "@/lib/auth";
import { SubscriptionTier } from "@/types/subscription";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptionTier } = await request.json();

    // Validate subscription tier
    if (!['free', 'paid', 'premium'].includes(subscriptionTier)) {
      return NextResponse.json(
        { error: "Invalid subscription tier" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      params.id,
      { subscriptionTier },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update subscription tier" },
      { status: 500 }
    );
  }
}
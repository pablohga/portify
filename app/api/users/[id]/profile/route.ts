import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";
import { authOptions } from "@/lib/auth-options";
import { isAdmin } from "@/lib/auth";

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const admin = await isAdmin();
    
    // Only allow users to edit their own profile or admins to edit any profile
    if (!session || (!admin && session.user.id !== params.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, image } = await request.json();
    await dbConnect();
    
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is being changed and if it's already in use
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    user.name = name;
    user.email = email;
    if (image) user.image = image;
    
    await user.save();

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
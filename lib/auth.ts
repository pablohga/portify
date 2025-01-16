import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { User } from "@/models/user";
import dbConnect from "./db";

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return null;
    }

    return {
      ...user.toObject(),
      _id: user._id.toString(),
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isAdmin() {
  try {
    const user = await getCurrentUser();
    return user?.role === "admin";
  } catch (error) {
    return false;
  }
}
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";
import { sendWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, password, slug, subscriptionTier = "free" } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate a slug based on the user's name
    const baseSlug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""); // Only allow lowercase letters, numbers, and hyphens
    let uniqueSlug = baseSlug;
    let count = 1;

    // Ensure slug is unique
    while (await User.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the generated slug
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      slug: slug || uniqueSlug,
      role: "user",
      subscriptionTier,
    });
    console.log("user:", user);
    // Attempt to send a welcome email, log the error if it fails
    try {
      await sendWelcomeEmail(email, name);
      console.log("Welcome email sent to:", email);
      console.log("slug:", slug);
      
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return NextResponse.json(
      {
        message: "User registered successfully!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          slug: user.slug, // Include the slug in the response
          subscriptionTier: user.subscriptionTier,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Home } from "@/models/home";
import { authOptions } from "@/lib/auth-options";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const home = await Home.findOne().sort({ createdAt: -1 });
    return NextResponse.json({ plans: home?.pricingSection?.plans || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch payment plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const admin = await isAdmin();
    
    if (!session || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { plans } = await request.json();
    
    // Get the current home data
    let home = await Home.findOne().sort({ createdAt: -1 });
    
    if (!home) {
      home = new Home({
        userId: session.user.id,
        pricingSection: {
          title: "Planos que Crescem com Você",
          subtitle: "Escolha o plano perfeito para suas necessidades. Comece gratuitamente e evolua conforme seu negócio cresce.",
          plans,
        },
      });
    } else {
      home.pricingSection = {
        ...home.pricingSection,
        plans,
      };
    }
    
    await home.save();
    
    return NextResponse.json({ message: "Payment plans updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update payment plans" },
      { status: 500 }
    );
  }
}
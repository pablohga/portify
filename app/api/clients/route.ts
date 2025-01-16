import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Client } from "@/models/client";
import { authOptions } from "@/lib/auth-options";

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    await dbConnect();
    const clients = await Client.find(userId ? { userId } : {}).sort({ createdAt: -1 });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch clients" },
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

    const client = await Client.create({
      ...data,
      userId: session.user.id,
    });

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

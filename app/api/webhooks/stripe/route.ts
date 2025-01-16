import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import dbConnect from "@/lib/db";
import { handleCheckoutCompleted } from "@/lib/stripe/webhook";

export const dynamic = 'force-dynamic'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    await dbConnect();

    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object as any);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
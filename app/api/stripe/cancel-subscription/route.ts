import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    // Find the customer in Stripe
    const customers = await stripe.customers.list({
      email,
      limit: 1,
      expand: ['data.subscriptions']
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const customer = customers.data[0];
    const subscription = customer.subscriptions?.data[0];

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Cancel the subscription at period end
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true
    });

    return NextResponse.json({
      message: "Subscription will be cancelled at the end of the billing period"
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
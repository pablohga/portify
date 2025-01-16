import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Get all users with paid or premium subscriptions
    const users = await User.find({
      subscriptionTier: { $in: ['free', 'paid', 'premium'] }
    });

    const updates = await Promise.all(users.map(async (user) => {
      try {
        // Find customer in Stripe
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1,
          expand: ['data.subscriptions']
        });

        const customer = customers.data[0];
        if (!customer) {
          // No Stripe customer found - revert to free tier
          user.subscriptionTier = 'free';
          await user.save();
          return { email: user.email, status: 'reverted to free (no customer)' };
        }

        const subscription = customer.subscriptions?.data[0];
        if (!subscription || subscription.status !== 'active') {
          // No active subscription - revert to free tier
          user.subscriptionTier = 'free';
          await user.save();
          return { email: user.email, status: 'reverted to free (no subscription)' };
        }

        // Check subscription plan and update tier if needed
        const priceId = subscription.items.data[0].price.id;
        const newTier =
        priceId === process.env.STRIPE_PRICE_ID_PREMIUM ||
        priceId === process.env.STRIPE_PRICE_ID_PREMIUM_BRL ||
        priceId === process.env.STRIPE_PRICE_ID_PREMIUM_EUR
          ? 'premium' 
          : 'paid';

        if (user.subscriptionTier !== newTier) {
          user.subscriptionTier = newTier;
          await user.save();
          return { email: user.email, status: `updated to ${newTier}` };
        }

        return { email: user.email, status: 'verified' };
      } catch (error) {
        return { email: user.email, status: 'error', error: (error as Error).message };
      }
    }));

    return NextResponse.json({ 
      message: "Subscription verification completed",
      updates 
    });
  } catch (error) {
    console.error("Subscription verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify subscriptions" },
      { status: 500 }
    );
  }
}
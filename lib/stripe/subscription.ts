import { stripe } from "@/lib/stripe";
import type { SubscriptionTier } from "@/types/subscription";

export async function verifyStripeSubscription(email: string): Promise<SubscriptionTier> {
  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
      expand: ['data.subscriptions']
    });

    if (customers.data.length === 0) {
      return 'free';
    }

    const customer = customers.data[0];
    const subscription = customer.subscriptions?.data[0];

    if (!subscription || subscription.status !== 'active') {
      return 'free';
    }

    const priceId = subscription.items.data[0].price.id;
    const premiumPriceId = process.env.STRIPE_PRICE_ID_PREMIUM;
    const paidPriceId = process.env.STRIPE_PRICE_ID_PAID;

    if (!premiumPriceId || !paidPriceId) {
      console.error('Missing Stripe price IDs in environment variables');
      return 'free';
    }

    if (priceId === premiumPriceId) {
      return 'premium';
    } else if (priceId === paidPriceId) {
      return 'paid';
    }

    return 'free';
  } catch (error) {
    console.error('Error verifying Stripe subscription:', error);
    return 'free';
  }
}
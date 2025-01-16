import { stripe } from '@/lib/stripe';

const PRICE_IDS = {
  paid: process.env.STRIPE_PRICE_ID_PAID!,
  premium: process.env.STRIPE_PRICE_ID_PREMIUM!,
};

export async function createCheckoutSession(params: {
  plan: string;
  email: string;
  name: string;
  password: string;
  origin: string;
}) {
  const { plan, email, origin } = params;

  if (!PRICE_IDS[plan as keyof typeof PRICE_IDS]) {
    throw new Error("Invalid plan");
  }

  const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];

  return stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${origin}/auth/register?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/auth/register`,
    customer_email: email,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    payment_method_types: ['card'],
  });
}

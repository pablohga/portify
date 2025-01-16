import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { plan } = await request.json();
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const priceId = plan === 'premium' 
      ? process.env.STRIPE_PRICE_ID_PREMIUM 
      : process.env.STRIPE_PRICE_ID_PAID;

    if (!priceId) {
      throw new Error('Invalid plan or missing price ID');
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&email={CUSTOMER_EMAIL}&plan=${plan}`,
      cancel_url: `${origin}/`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      payment_method_types: ['card'],
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
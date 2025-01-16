import { stripe } from '@/lib/stripe';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';
import type Stripe from 'stripe';

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_details?.email;
  const subscriptionId = session.subscription as string;
  const metadata = session.metadata || {};

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0].price.id;

  const tier = 
    priceId === process.env.STRIPE_PRICE_ID_PREMIUM ||
    priceId === process.env.STRIPE_PRICE_ID_PREMIUM_BRL ||
    priceId === process.env.STRIPE_PRICE_ID_PREMIUM_EUR 
    ? 'premium' 
    : 'paid';

  const existingUser = await User.findOne({ email: customerEmail });
  
  if (!existingUser && metadata.password) {
    const hashedPassword = await bcrypt.hash(metadata.password, 10);
    const name = metadata.name || customerEmail?.split('@')[0];
    
    await User.create({
      name,
      email: customerEmail,
      password: hashedPassword,
      subscriptionTier: tier,
      role: 'user'
    });
  } else if (existingUser) {
    existingUser.subscriptionTier = tier;
    await existingUser.save();
  }
}
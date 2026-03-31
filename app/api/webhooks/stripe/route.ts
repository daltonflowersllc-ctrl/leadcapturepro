export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

function planTierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) return 'pro';
  if (priceId === process.env.STRIPE_STARTER_MONTHLY_PRICE_ID) return 'starter';
  return 'starter';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const db = getDb();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId && session.customer && session.subscription) {
          await db
            .update(users)
            .set({
              subscriptionStatus: 'active',
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.customer) {
          await db
            .update(users)
            .set({ subscriptionStatus: 'canceled', updatedAt: new Date() })
            .where(eq(users.stripeCustomerId, sub.customer as string));
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price?.id;
        if (sub.customer && priceId) {
          const tier = planTierFromPriceId(priceId);
          await db
            .update(users)
            .set({ tier, updatedAt: new Date() })
            .where(eq(users.stripeCustomerId, sub.customer as string));
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          await db
            .update(users)
            .set({ subscriptionStatus: 'past_due', updatedAt: new Date() })
            .where(eq(users.stripeCustomerId, invoice.customer as string));
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

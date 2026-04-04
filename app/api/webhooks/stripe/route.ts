export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { sendPaymentFailedEmail, sendAccountSuspendedEmail } from '@/lib/email';

function planTierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) return 'pro';
  if (priceId === process.env.STRIPE_STARTER_MONTHLY_PRICE_ID) return 'starter';
  if (priceId === process.env.STRIPE_ELITE_MONTHLY_PRICE_ID) return 'elite';
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
        const customerEmail = session.customer_details?.email;
        const priceId = session.line_items?.data[0]?.price?.id || session.metadata?.priceId;

        if (customerEmail) {
          const tier = priceId ? planTierFromPriceId(priceId) : 'starter';
          await db
            .update(users)
            .set({
              subscriptionStatus: 'active',
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              tier,
              trialEndsAt: null,
              updatedAt: new Date(),
            })
            .where(eq(users.email, customerEmail));
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, invoice.customer as string)).limit(1);
          if (user) {
            await db
              .update(users)
              .set({ subscriptionStatus: 'past_due', updatedAt: new Date() })
              .where(eq(users.id, user.id));
            await sendPaymentFailedEmail(user.email);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.customer) {
          const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, sub.customer as string)).limit(1);
          if (user) {
            await db
              .update(users)
              .set({ subscriptionStatus: 'canceled', tier: 'starter', updatedAt: new Date() })
              .where(eq(users.id, user.id));
            await sendAccountSuspendedEmail(user.email);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price?.id;
        if (sub.customer && priceId) {
          const tier = planTierFromPriceId(priceId);
          const updateData: any = { tier, updatedAt: new Date() };
          if (sub.status === 'active') {
            updateData.subscriptionStatus = 'active';
          }
          await db
            .update(users)
            .set(updateData)
            .where(eq(users.stripeCustomerId, sub.customer as string));
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          await db
            .update(users)
            .set({ subscriptionStatus: 'active', updatedAt: new Date() })
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

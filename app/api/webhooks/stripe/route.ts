import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    console.log('Stripe webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
        // New subscription created
        // TODO: Update user subscription status in database
        break;

      case 'customer.subscription.updated':
        // Subscription updated (tier changed, etc)
        // TODO: Update user subscription in database
        break;

      case 'customer.subscription.deleted':
        // Subscription canceled
        // TODO: Update user subscription status to 'canceled'
        break;

      case 'invoice.payment_succeeded':
        // Payment successful
        // TODO: Update billing cycle dates
        break;

      case 'invoice.payment_failed':
        // Payment failed
        // TODO: Update subscription status to 'past_due'
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

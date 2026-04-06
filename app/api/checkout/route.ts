export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
  pro: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
};

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const validPlans = ['starter', 'pro', 'elite'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ error: `No price configured for plan: ${plan}` }, { status: 400 });
    }

    const userRecord = await db
      .select({ email: users.email, stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      payment_method_collection: 'always',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url: `${appUrl}/subscribe`,
      customer_email: userRecord[0].stripeCustomerId ? undefined : userRecord[0].email,
      customer: userRecord[0].stripeCustomerId || undefined,
      metadata: { userId: payload.userId, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

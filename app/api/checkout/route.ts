export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

const PRICE_IDS: Record<string, string | undefined> = {
  essential: process.env.STRIPE_ESSENTIAL_MONTHLY_PRICE_ID,
  premium: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
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

    const validPlans = ['essential', 'premium', 'elite'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ error: `No price configured for plan: ${plan}` }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', payload.userId)
      .limit(1)
      .single();

    if (!user) {
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
      customer_email: user.stripe_customer_id ? undefined : user.email,
      customer: user.stripe_customer_id || undefined,
      metadata: { userId: payload.userId, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

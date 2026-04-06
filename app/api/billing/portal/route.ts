export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('stripe_customer_id')
    .eq('id', payload.userId)
    .limit(1)
    .single();

  if (!user || !user.stripe_customer_id) {
    return NextResponse.json({ error: 'Stripe customer not found' }, { status: 404 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://leadcapturepro.app'}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}

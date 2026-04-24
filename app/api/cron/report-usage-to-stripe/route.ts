export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('id, email, stripe_subscription_id, sms_used_this_month, tier')
    .eq('subscription_status', 'active')
    .not('stripe_subscription_id', 'is', null);

  if (error) {
    console.error('report-usage-to-stripe cron: failed to fetch users', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ processed: 0, reported: 0 });
  }

  let reported = 0;
  const errors: string[] = [];

  for (const user of users) {
    if (!user.stripe_subscription_id) continue;

    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
      const meteredItem = subscription.items.data.find(
        (item) => item.price.recurring?.usage_type === 'metered',
      );

      if (!meteredItem) continue;

      await stripe.subscriptionItems.createUsageRecord(meteredItem.id, {
        quantity: user.sms_used_this_month || 0,
        timestamp: Math.floor(Date.now() / 1000),
        action: 'set',
      });

      reported++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`report-usage-to-stripe: failed for user ${user.id}:`, msg);
      errors.push(`${user.id}: ${msg}`);
    }
  }

  return NextResponse.json({ processed: users.length, reported, errors });
}

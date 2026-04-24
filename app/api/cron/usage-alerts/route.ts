export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { TIER_LIMITS, Tier } from '@/lib/limits';
import { sendEmail } from '@/lib/email';
import { usage80Email, usage100Email, usage200Email } from '@/lib/emails/templates';

interface AlertState {
  month: string;
  sent80: boolean;
  sent100: boolean;
  sent200: boolean;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('id, email, name, business_name, tier, sms_used_this_month, subscription_status, usage_alerts_sent')
    .in('subscription_status', ['trial', 'active']);

  if (error) {
    console.error('usage-alerts cron: failed to fetch users', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ processed: 0, alertsSent: 0 });
  }

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  let alertsSent = 0;

  for (const user of users) {
    const tier = (user.tier || 'starter') as Tier;
    const limit = TIER_LIMITS[tier]?.smsPerMonth ?? TIER_LIMITS.starter.smsPerMonth;
    const used = user.sms_used_this_month || 0;
    const percentage = limit > 0 ? (used / limit) * 100 : 0;

    const raw = user.usage_alerts_sent as AlertState | null;
    const alertState: AlertState =
      raw && raw.month === currentMonth
        ? raw
        : { month: currentMonth, sent80: false, sent100: false, sent200: false };

    const ownerName = user.name || 'there';
    const businessName = user.business_name || user.name || 'your business';

    let updated = false;

    if (percentage >= 200 && !alertState.sent200) {
      await sendEmail(
        user.email,
        '🚨 Your SMS limit has been exceeded by 200% — Action Required',
        usage200Email({ ownerName, businessName, used, limit, tier }),
      );
      alertState.sent200 = true;
      updated = true;
      alertsSent++;
    }

    if (percentage >= 100 && !alertState.sent100) {
      await sendEmail(
        user.email,
        "⚠️ You've hit your monthly SMS limit — Upgrade to keep capturing leads",
        usage100Email({ ownerName, businessName, used, limit, tier }),
      );
      alertState.sent100 = true;
      updated = true;
      alertsSent++;
    }

    if (percentage >= 80 && !alertState.sent80) {
      await sendEmail(
        user.email,
        "📊 You're at 80% of your monthly SMS limit",
        usage80Email({ ownerName, businessName, used, limit, tier }),
      );
      alertState.sent80 = true;
      updated = true;
      alertsSent++;
    }

    if (updated) {
      await supabaseAdmin
        .from('users')
        .update({ usage_alerts_sent: alertState, updated_at: now.toISOString() })
        .eq('id', user.id);
    }
  }

  return NextResponse.json({ processed: users.length, alertsSent });
}

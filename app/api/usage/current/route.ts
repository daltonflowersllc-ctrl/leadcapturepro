export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/auth';
import { TIER_LIMITS, Tier } from '@/lib/limits';

export async function GET(request: NextRequest) {
  const cookieToken = request.cookies.get('auth-token')?.value;
  const bearerToken = request.headers.get('Authorization')?.slice(7);
  const token = cookieToken || bearerToken;
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, tier, subscription_status, sms_used_this_month, sms_reset_date')
    .eq('id', payload.userId)
    .limit(1)
    .single();

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const tier = (user.tier || 'starter') as Tier;
  const smsLimit = TIER_LIMITS[tier]?.smsPerMonth ?? TIER_LIMITS.starter.smsPerMonth;

  let smsUsed = user.sms_used_this_month || 0;
  const now = new Date();
  const resetDate = user.sms_reset_date ? new Date(user.sms_reset_date) : null;
  if (!resetDate || resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
    smsUsed = 0;
  }

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count: leadsThisMonth } = await supabaseAdmin
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', monthStart);

  const { count: callsThisMonth } = await supabaseAdmin
    .from('calls')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', monthStart);

  return NextResponse.json({
    sms: {
      used: smsUsed,
      limit: smsLimit,
      percentage: smsLimit > 0 ? Math.round((smsUsed / smsLimit) * 100) : 0,
    },
    leads: {
      thisMonth: leadsThisMonth ?? 0,
    },
    calls: {
      thisMonth: callsThisMonth ?? 0,
    },
    tier,
    subscriptionStatus: user.subscription_status,
  });
}

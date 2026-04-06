export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/auth';
import { checkSmsLimit, Tier } from '@/lib/limits';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, tier, subscription_status')
    .eq('id', payload.userId)
    .limit(1)
    .single();

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const usage = await checkSmsLimit(user.id, user.tier as Tier);

  return NextResponse.json({
    smsUsed: usage.used,
    smsLimit: usage.limit,
    percentage: usage.percentage,
    tier: user.tier,
    subscriptionStatus: user.subscription_status,
  });
}

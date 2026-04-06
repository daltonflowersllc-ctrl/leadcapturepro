export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { token, userId, subscription } = await request.json();

    if (!token || !userId || !subscription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.userId !== userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await supabaseAdmin
      .from('users')
      .update({ push_subscription: JSON.stringify(subscription) })
      .eq('id', userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

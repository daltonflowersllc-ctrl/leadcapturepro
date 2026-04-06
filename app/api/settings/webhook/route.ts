export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: userRow } = await supabaseAdmin
      .from('users')
      .select('tier')
      .eq('id', payload.userId)
      .limit(1)
      .single();

    if (!userRow) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tier = userRow.tier;
    if (tier !== 'pro' && tier !== 'elite') {
      return NextResponse.json(
        { error: 'Zapier integration requires a Pro or Elite plan' },
        { status: 403 }
      );
    }

    const { webhookUrl } = await request.json();
    if (webhookUrl !== null && webhookUrl !== '' && typeof webhookUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid webhook URL' }, { status: 400 });
    }

    await supabaseAdmin
      .from('users')
      .update({ webhook_url: webhookUrl || null, updated_at: new Date().toISOString() })
      .eq('id', payload.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save webhook URL error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

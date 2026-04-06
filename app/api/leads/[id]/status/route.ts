export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieToken = request.cookies.get('auth-token')?.value;
    const authHeader = request.headers.get('Authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { status } = await request.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    await supabaseAdmin
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .eq('user_id', payload.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update lead status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

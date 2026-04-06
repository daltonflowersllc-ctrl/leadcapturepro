export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    const { data: userLeads } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false });

    return NextResponse.json({ leads: userLeads ?? [] });
  } catch (error) {
    console.error('Dashboard leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

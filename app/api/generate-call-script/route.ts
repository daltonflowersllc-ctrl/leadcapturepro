export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/auth';
import { generateCallScripts } from '@/lib/ai';

export async function POST(request: NextRequest) {
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

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Lead id is required' }, { status: 400 });
    }

    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('caller_name, service_needed, urgency, notes, form_data')
      .eq('id', id)
      .eq('user_id', payload.userId)
      .limit(1)
      .single();

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const formData = (lead.form_data || {}) as Record<string, string>;

    const scripts = await generateCallScripts(
      lead.caller_name,
      lead.service_needed || formData.serviceType || '',
      lead.urgency || '',
      formData.budget || '',
      formData.description || lead.notes || ''
    );

    return NextResponse.json({ scripts });
  } catch (error) {
    console.error('Generate call script error:', error);
    return NextResponse.json({ error: 'Failed to generate call script' }, { status: 500 });
  }
}

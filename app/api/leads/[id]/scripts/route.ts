export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/auth';
import { generateCallScripts } from '@/lib/ai';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('caller_name, service_needed, urgency, notes, form_data')
      .eq('id', params.id)
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
    console.error('Generate call scripts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

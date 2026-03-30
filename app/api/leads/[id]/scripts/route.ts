export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
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

    const leadRecord = await getDb()
      .select({
        callerName: leads.callerName,
        serviceNeeded: leads.serviceNeeded,
        urgency: leads.urgency,
        notes: leads.notes,
        formData: leads.formData,
      })
      .from(leads)
      .where(and(eq(leads.id, params.id), eq(leads.userId, payload.userId)))
      .limit(1);

    if (leadRecord.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leadRecord[0];
    const formData = (lead.formData || {}) as Record<string, string>;

    const scripts = await generateCallScripts(
      lead.callerName,
      lead.serviceNeeded || formData.serviceType || '',
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

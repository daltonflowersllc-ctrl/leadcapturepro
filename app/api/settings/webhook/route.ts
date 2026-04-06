export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
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

    // Verify user is Pro or Elite tier
    const userRecord = await db
      .select({ tier: users.tier })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tier = userRecord[0].tier;
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

    await db
      .update(users)
      .set({ webhookUrl: webhookUrl || null, updatedAt: new Date() })
      .where(eq(users.id, payload.userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save webhook URL error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

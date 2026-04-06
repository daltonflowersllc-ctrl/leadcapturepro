export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
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

    const { notes } = await request.json();
    if (notes === undefined) {
      return NextResponse.json({ error: 'Notes field is required' }, { status: 400 });
    }

    await db
      .update(leads)
      .set({ notes, updatedAt: new Date() })
      .where(and(eq(leads.id, params.id), eq(leads.userId, payload.userId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update lead notes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

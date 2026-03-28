export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
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

    const userLeads = await getDb()
      .select()
      .from(leads)
      .where(eq(leads.userId, payload.userId))
      .orderBy(desc(leads.createdAt));

    return NextResponse.json({ leads: userLeads });
  } catch (error) {
    console.error('Dashboard leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

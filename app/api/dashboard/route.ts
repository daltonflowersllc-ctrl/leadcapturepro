import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { phoneNumbers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const phoneResult = await getDb()
      .select({ twilioPhoneNumber: phoneNumbers.twilioPhoneNumber, twilioSid: phoneNumbers.twilioSid })
      .from(phoneNumbers)
      .where(eq(phoneNumbers.userId, payload.userId))
      .limit(1);

    const assignedPhone = phoneResult[0]?.twilioPhoneNumber ?? null;
    const assignedPhoneSid = phoneResult[0]?.twilioSid ?? null;

    const dashboardData = {
      user: {
        id: payload.userId,
        email: payload.email,
        tier: payload.tier,
      },
      assignedPhone,
      assignedPhoneSid,
      stats: {
        missedCalls: 0,
        leadsCapture: 0,
        responseRate: 0,
        thisMonth: {
          calls: 0,
          leads: 0,
        },
      },
      recentCalls: [],
      recentLeads: [],
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

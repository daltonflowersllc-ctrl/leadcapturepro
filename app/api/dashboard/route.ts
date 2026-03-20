import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
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

    // TODO:
    // 1. Query user data from database
    // 2. Get recent calls
    // 3. Get recent leads
    // 4. Get usage statistics
    // 5. Get subscription info

    const dashboardData = {
      user: {
        id: payload.userId,
        email: payload.email,
        tier: payload.tier,
      },
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

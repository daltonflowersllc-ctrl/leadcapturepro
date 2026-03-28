import { NextRequest, NextResponse } from 'next/server';
import { generateToken, hashPassword, generateId } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, businessName, phone, plan } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const db = getDb();

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const userId = generateId();
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    const tier =
      plan === 'pro' ? 'pro' : plan === 'elite' ? 'elite' : 'starter';

    await db.insert(users).values({
      id: userId,
      email,
      password: hashedPassword,
      name,
      businessName: businessName || null,
      phone: phone || null,
      tier,
      subscriptionStatus: 'trial',
      trialEndsAt,
    });

    const token = generateToken({ userId, email, tier });

    return NextResponse.json(
      {
        success: true,
        user: { id: userId, email, name, businessName: businessName || null, tier, trialEndsAt },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

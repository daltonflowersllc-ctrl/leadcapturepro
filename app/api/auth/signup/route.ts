export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateToken, hashPassword } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users, phoneNumbers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import twilio from 'twilio';

function extractAreaCode(phone: string): number | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '1') {
    return parseInt(digits.substring(1, 4), 10);
  }
  if (digits.length === 10) {
    return parseInt(digits.substring(0, 3), 10);
  }
  return null;
}

async function provisionTwilioNumber(userId: string, userPhone: string | null): Promise<void> {
  const client = twilio(
    process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const webhookUrl = `${appUrl}/api/webhooks/twilio`;

  let availableNumber: string | null = null;

  // Try user's area code first
  if (userPhone) {
    const areaCode = extractAreaCode(userPhone);
    if (areaCode) {
      const numbers = await client.availablePhoneNumbers('US').local.list({ areaCode, limit: 1 });
      if (numbers.length > 0) {
        availableNumber = numbers[0].phoneNumber;
      }
    }
  }

  // Fallback: any available US local number
  if (!availableNumber) {
    const numbers = await client.availablePhoneNumbers('US').local.list({ limit: 1 });
    if (numbers.length > 0) {
      availableNumber = numbers[0].phoneNumber;
    }
  }

  if (!availableNumber) {
    throw new Error('No available Twilio phone numbers found');
  }

  const purchased = await client.incomingPhoneNumbers.create({
    phoneNumber: availableNumber,
    voiceUrl: webhookUrl,
    voiceMethod: 'POST',
    statusCallback: webhookUrl,
    statusCallbackMethod: 'POST',
  });

  const db = getDb();
  await db.insert(phoneNumbers).values({
    id: crypto.randomUUID(),
    userId,
    twilioPhoneNumber: purchased.phoneNumber,
    twilioSid: purchased.sid,
    isActive: true,
  });
}

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
    const userId = crypto.randomUUID();
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    const tier = plan === 'pro' ? 'pro' : plan === 'elite' ? 'elite' : 'starter';

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

    // Provision Twilio phone number; failures are non-fatal
    try {
      await provisionTwilioNumber(userId, phone || null);
    } catch (twilioError) {
      console.error('Twilio provisioning failed — account created, flagged for manual assignment:', twilioError);
    }

    const token = generateToken({ userId, email, tier });

    const response = NextResponse.json(
      {
        success: true,
        user: { id: userId, email, name, businessName: businessName || null, tier, trialEndsAt },
      },
      { status: 201 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { generateToken, hashPassword, generateId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, businessName } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    // TODO: Query database to check if email exists
    // For now, we'll assume it doesn't exist

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const userId = generateId();
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    // TODO: Insert user into database
    // const user = await db.insert(users).values({
    //   id: userId,
    //   email,
    //   password: hashedPassword,
    //   name,
    //   businessName,
    //   tier: 'basic',
    //   subscriptionStatus: 'trial',
    //   trialEndsAt,
    // });

    // Generate JWT token
    const token = generateToken({
      userId,
      email,
      tier: 'basic',
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: userId,
          email,
          name,
          businessName,
          tier: 'basic',
          trialEndsAt,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

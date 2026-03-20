import { NextRequest, NextResponse } from 'next/server';
import { generateToken, comparePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // TODO: Query database for user by email
    // const user = await db.query.users.findFirst({
    //   where: eq(users.email, email),
    // });

    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Invalid email or password' },
    //     { status: 401 }
    //   );
    // }

    // const passwordMatch = await comparePassword(password, user.password);
    // if (!passwordMatch) {
    //   return NextResponse.json(
    //     { error: 'Invalid email or password' },
    //     { status: 401 }
    //   );
    // }

    // Generate token
    // const token = generateToken({
    //   userId: user.id,
    //   email: user.email,
    //   tier: user.tier,
    // });

    // return NextResponse.json({
    //   success: true,
    //   user: {
    //     id: user.id,
    //     email: user.email,
    //     name: user.name,
    //     tier: user.tier,
    //     subscriptionStatus: user.subscriptionStatus,
    //   },
    //   token,
    // });

    return NextResponse.json(
      { error: 'Database not configured yet' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

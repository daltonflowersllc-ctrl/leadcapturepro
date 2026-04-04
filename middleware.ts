import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; tier: string };
    
    // For specific routes, we need to check the subscription status in the database
    const { pathname } = request.nextUrl;
    const protectedRoutes = ['/dashboard', '/api/dashboard', '/api/leads', '/settings'];
    
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      const db = getDb();
      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);

      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (user.subscriptionStatus === 'canceled') {
        return NextResponse.redirect(new URL('/reactivate', request.url));
      }

      const response = NextResponse.next();
      if (user.subscriptionStatus === 'past_due') {
        response.headers.set('x-payment-past-due', 'true');
      }
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/dashboard/:path*', '/settings/:path*'],
};

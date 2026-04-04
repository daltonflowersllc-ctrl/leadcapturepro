import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // If it's an API route, return 401 instead of redirecting
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Basic validation - check if token exists. 
  // Full JWT verification and DB checks should happen in Server Components or API routes 
  // because the Edge Runtime doesn't support some Node.js APIs (like crypto/jsonwebtoken/postgres)
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/dashboard/:path*', '/settings/:path*'],
};

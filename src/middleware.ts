// import withAuth from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');

  if (!token) return NextResponse.redirect(new URL('/denied', request.url));

  console.log('Pathname:', request.nextUrl.pathname);
  console.log('Token Role:', token.name);

  if (
    !request.nextUrl.pathname.startsWith('/manager') &&
    token.name === 'manager'
  ) {
    return NextResponse.redirect(new URL('/staff', request.url));
  }

  return NextResponse.next(); // Allow the request to proceed
}

export const config = {
  // matcher: ['/manager/:path*', '/my/:path*']
  matcher: []
};

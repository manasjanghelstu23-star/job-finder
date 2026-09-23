import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = "super-secret-key-change-me-in-production";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/institute/login') ||
    request.nextUrl.pathname.startsWith('/company/login');

  const isDashboardPage = 
    request.nextUrl.pathname.startsWith('/student') || 
    (request.nextUrl.pathname.startsWith('/company') && !request.nextUrl.pathname.startsWith('/company/login')) || 
    (request.nextUrl.pathname.startsWith('/institute') && !request.nextUrl.pathname.startsWith('/institute/login')) ||
    request.nextUrl.pathname.startsWith('/admin');

  if (isAuthPage && session) {
    try {
      const { payload } = await jwtVerify(session, key);
      const role = (payload.role as string).toLowerCase();
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    } catch (e) {
      // Invalid session, let them stay on auth page
    }
  }

  if (isDashboardPage) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(session, key);
      const role = (payload.role as string).toLowerCase();

      // Check if trying to access another role's dashboard
      if (request.nextUrl.pathname.startsWith(`/student`) && role !== 'student') {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
      }
      if (request.nextUrl.pathname.startsWith(`/company`) && role !== 'company') {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
      }
      if (request.nextUrl.pathname.startsWith(`/institute`) && role !== 'institute') {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
      }
      if (request.nextUrl.pathname.startsWith(`/admin`) && role !== 'admin') {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
      }

    } catch (error) {
      // Invalid session, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

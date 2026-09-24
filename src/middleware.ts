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

  // Allow auth pages if no session
  if (isAuthPage && session) {
    // If explicitly navigating to login, allow stay or redirect
  }

  // If dashboard route accessed without session, redirect to login
  if (isDashboardPage && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // In prototype demo mode, allow free navigation between student, company, institute dashboards
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

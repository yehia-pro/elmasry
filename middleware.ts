import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'elmasry_session_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Guard Admin Routes
  if (pathname.startsWith('/admin')) {
    // Public admin endpoints
    if (pathname === '/admin/login' || pathname === '/admin/setup') {
      return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Decode JWT payload safely in edge environment
      const parts = token.split('.');
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(base64);
        const payload = JSON.parse(decoded);

        if (payload.role !== 'ADMIN' && payload.role !== 'SUPERADMIN') {
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }
      } else {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. Guard Student Dashboard Route
  if (pathname.startsWith('/student/dashboard')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL('/student/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/student/:path*'],
};


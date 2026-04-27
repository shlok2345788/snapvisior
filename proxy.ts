import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') || '';
    const allowedOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '';
    const allowOrigin = allowedOrigin && origin === allowedOrigin;

    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (allowOrigin) {
      corsHeaders['Access-Control-Allow-Origin'] = origin;
      corsHeaders['Vary'] = 'Origin';
    }

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    const response = NextResponse.next();
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }
    return response;
  }

  // Protect Admin Routes
  if (pathname.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('snapvior-admin')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect Worker Routes
  if (pathname.startsWith('/worker/dashboard')) {
    const token = request.cookies.get('snapvior-worker')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/worker/login', request.url));
    }
    const payload = await verifyToken(token);
    if (!payload || (payload.role !== 'WORKER' && payload.role !== 'ADMIN')) {
        return NextResponse.redirect(new URL('/worker/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/admin/dashboard/:path*', '/worker/dashboard/:path*'],
};

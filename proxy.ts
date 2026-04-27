import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ['/admin/dashboard/:path*', '/worker/dashboard/:path*'],
};

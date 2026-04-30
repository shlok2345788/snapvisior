import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Serve/normalize model manifest JSONs as arrays so tfjs/face-api doesn't crash
  if (pathname.startsWith('/models/') && pathname.endsWith('weights_manifest.json')) {
    try {
      const rel = pathname.replace(/^\/models\//, '');
      const full = path.join(process.cwd(), 'public', 'models', rel);
      const data = await fs.readFile(full);
      const text = data.toString('utf8');
      try {
        const parsed = JSON.parse(text);
        const out = Array.isArray(parsed) ? parsed : [parsed];
        return new NextResponse(JSON.stringify(out), {
          status: 200,
          headers: { 'content-type': 'application/json; charset=utf-8' },
        });
      } catch (e) {
        return new NextResponse(text, {
          status: 200,
          headers: { 'content-type': 'application/json; charset=utf-8' },
        });
      }
    } catch (err) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
  }

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
  matcher: ['/api/:path*', '/admin/dashboard/:path*', '/worker/dashboard/:path*', '/models/:path*'],
};

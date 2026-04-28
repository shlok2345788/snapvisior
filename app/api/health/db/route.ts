import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isDatabaseConnectionError } from '@/lib/prisma-errors';

function getDatabaseHost() {
  const raw = process.env.DATABASE_URL || '';
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return url.hostname;
  } catch {
    return 'invalid-database-url';
  }
}

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      status: 'connected',
      databaseHost: getDatabaseHost(),
    });
  } catch (err) {
    const dbUnavailable = isDatabaseConnectionError(err);

    return NextResponse.json(
      {
        ok: false,
        status: dbUnavailable ? 'unavailable' : 'error',
        databaseHost: getDatabaseHost(),
        message: dbUnavailable
          ? 'Database connection failed. Verify DATABASE_URL and Railway network access.'
          : 'Unexpected database error.',
      },
      { status: dbUnavailable ? 503 : 500 }
    );
  }
}

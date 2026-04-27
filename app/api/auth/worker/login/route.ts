import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePasswords, createToken, setAuthCookie } from '@/lib/auth';
import { isDatabaseConnectionError } from '@/lib/prisma-errors';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Find worker
    const worker = await prisma.user.findFirst({
      where: {
        username,
        role: 'WORKER',
      },
    });

    if (!worker || !worker.password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValid = await comparePasswords(password, worker.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create Token
    const token = await createToken({
      id: worker.id,
      username: worker.username,
      role: 'WORKER',
    });

    // Set Cookie
    await setAuthCookie(token, 'snapvior-worker');

    return NextResponse.json({ message: 'Login successful' });
  } catch (err: any) {
    console.error('Worker Login Error:', err);

    if (isDatabaseConnectionError(err)) {
      return NextResponse.json(
        { message: 'Database is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

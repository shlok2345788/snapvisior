import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createToken, setAuthCookie } from '@/lib/auth';
import { isDatabaseConnectionError } from '@/lib/prisma-errors';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    // Find the latest valid OTP
    const storedOtp = await prisma.adminOTP.findFirst({
      where: {
        email,
        otp,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!storedOtp) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 401 });
    }

    // OTP is valid - Create Admin Session
    const token = await createToken({
      email,
      username: 'shlok',
      role: 'ADMIN',
    });

    // Set Cookie
    await setAuthCookie(token, 'snapvior-admin');

    // Delete used OTP
    await prisma.adminOTP.deleteMany({
      where: { email },
    });

    return NextResponse.json({ message: 'Login successful' });
  } catch (err: any) {
    console.error('Verify Error:', err);

    if (isDatabaseConnectionError(err)) {
      return NextResponse.json(
        { message: 'Database is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

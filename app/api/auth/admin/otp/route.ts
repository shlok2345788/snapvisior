import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOTPEmail } from '@/lib/email';
import crypto from 'crypto';
import { isDatabaseConnectionError } from '@/lib/prisma-errors';

export async function POST(req: NextRequest) {
  try {
    const { username, email } = await req.json();

    // Verify admin credentials
    if (username !== 'shlok' || email !== 'shloklokhande07@gmail.com') {
      return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in DB
    await prisma.adminOTP.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    // Send Email
    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (err: any) {
    console.error('OTP Error:', err);
    console.error('Error Name:', err?.name);
    console.error('Error Message:', err?.message);
    console.error('Error Code:', err?.code);

    if (isDatabaseConnectionError(err)) {
      return NextResponse.json(
        { message: 'Database is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ message: 'Internal server error', error: err?.message }, { status: 500 });
  }
}

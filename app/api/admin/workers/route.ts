import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('snapvior-admin')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const workers = await prisma.user.findMany({
      where: { role: 'WORKER' },
      select: { id: true, username: true, createdAt: true },
    });

    return NextResponse.json(workers);
  } catch (err) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('snapvior-admin')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password required' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const worker = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'WORKER',
      },
    });

    return NextResponse.json({ id: worker.id, username: worker.username });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

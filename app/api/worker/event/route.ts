import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import QRCode from 'qrcode';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Verify Worker/Admin session
    const token = (await cookies()).get('snapvior-worker')?.value || 
                  (await cookies()).get('snapvior-admin')?.value;
    
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
        return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
    }

    const { name } = await req.json();

    // Generate unique 4-digit code
    let code = '';
    let isUnique = false;
    while (!isUnique) {
      code = Math.floor(1000 + Math.random() * 9000).toString();
      const existing = await prisma.event.findUnique({ where: { code } });
      if (!existing) isUnique = true;
    }

    // Generate QR Code as DataURL (base64)
    // In production, you'd upload this to Cloudinary, but base64 works for a starter!
    const galleryUrl = `${process.env.NEXT_PUBLIC_APP_URL}/gallery/${code}`;
    const qrCodeDataUrl = await QRCode.toDataURL(galleryUrl, {
        color: {
            dark: '#6366f1', // primary color
            light: '#0000',  // transparent
        },
        margin: 1,
        width: 400
    });

    // Create Event in DB
    const event = await prisma.event.create({
      data: {
        name,
        code,
        qrCode: qrCodeDataUrl,
        userId: payload.id as string,
      },
    });

    return NextResponse.json(event);
  } catch (err: any) {
    console.error('Event Creation Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { media: true }
        }
      }
    });

    // Map _count.media to mediaCount for frontend compatibility
    const formattedEvents = events.map(event => ({
      ...event,
      mediaCount: event._count.media,
    }));

    return NextResponse.json(formattedEvents);
  } catch (err) {
    console.error('Fetch Events Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

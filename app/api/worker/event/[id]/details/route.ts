import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('API Request: Fetching details for event id:', id);

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        media: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!event) {
      console.warn('API Warning: Event not found for id:', id);
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Fetch Event Details API Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

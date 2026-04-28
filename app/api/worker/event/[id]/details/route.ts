import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getB2SignedReadUrl } from '@/lib/b2';

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

    const signedEvent = {
      ...event,
      media: await Promise.all(
        event.media.map(async (item) => ({
          ...item,
          url: await getB2SignedReadUrl(item.url),
        }))
      ),
    };

    return NextResponse.json(signedEvent);
  } catch (error) {
    console.error('Fetch Event Details API Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

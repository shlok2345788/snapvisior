import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getB2SignedReadUrl } from '@/lib/b2';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const paramsResolved = await params;
    const id = paramsResolved.id.trim();
    console.log('API Request: Fetching details for event id:', id, typeof id, id.length);

    const allEvents = await prisma.event.findMany({ select: { id: true } });
    console.log('All event IDs:', allEvents.map(e => e.id));

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

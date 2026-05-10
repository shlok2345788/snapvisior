import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getB2ObjectKeyFromStoredValue } from '@/lib/b2';

type Body = {
  eventId: string;
  imageUrl: string;
  descriptors: number[][];
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  if (!body || !body.eventId || !body.imageUrl || !Array.isArray(body.descriptors)) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { id: body.eventId } });
  if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });

  const created = await prisma.media.create({
    data: {
      url: getB2ObjectKeyFromStoredValue(body.imageUrl) || body.imageUrl,
      eventId: body.eventId,
      faces: body.descriptors,
    },
  });

  return NextResponse.json({ media: created });
}

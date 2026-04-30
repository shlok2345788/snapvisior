import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getB2SignedReadUrl } from '@/lib/b2';

type Body = {
  eventCode: string;
  descriptor: number[];
  limit?: number;
};

function euclideanDistance(a: number[], b: number[]) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  if (!body || !body.eventCode || !Array.isArray(body.descriptor)) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { code: body.eventCode } });
  if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });

  const medias = await prisma.media.findMany({ where: { eventId: event.id } });

  const matches: Array<{ id: string; url: string; confidence: number }> = [];

  for (const media of medias) {
    if (!media.faces) continue;
    // media.faces is stored as JSON: array of descriptor arrays
    const descriptors = media.faces as unknown as number[][];
    for (const stored of descriptors) {
      const dist = euclideanDistance(stored, body.descriptor);
      const confidence = Math.max(0, 1 - dist);
      if (dist < 0.55) {
        const url = await getB2SignedReadUrl(media.url);
        matches.push({ id: media.id, url, confidence });
        break; // once match found for this image, move to next image
      }
    }
  }

  return NextResponse.json({ matches });
}

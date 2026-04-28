import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { deleteB2Object } from '@/lib/b2';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Attempt to delete Backblaze B2 objects belonging to this event folder.
    try {
      const mediaItems = await prisma.media.findMany({
        where: { eventId: id },
        select: { publicId: true },
      });

      await Promise.all(
        mediaItems
          .filter((item) => Boolean(item.publicId))
          .map((item) => deleteB2Object(item.publicId as string))
      );
    } catch {
      console.error('Could not clean up Backblaze B2 objects for event:', id);
    }

    // Delete from database (Media will be deleted via Cascade)
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Event successfully deleted' });
  } catch (error) {
    console.error('Delete Event API Error:', error);
    return NextResponse.json({ message: 'Server error during deletion' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { deleteCloudinaryAssetsByPrefix } from '@/lib/cloudinary';

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

    // Attempt to delete Cloudinary assets belonging to this event folder.
    try {
      await deleteCloudinaryAssetsByPrefix(`snapvisor/events/${id}/`);
    } catch {
      console.error('Could not clean up Cloudinary files for event:', id);
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

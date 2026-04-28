import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { deleteB2Object } from '@/lib/b2';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Find the media record
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json({ message: 'Media not found' }, { status: 404 });
    }

    // Delete from Backblaze B2 when available.
    if (media.publicId) {
      try {
        await deleteB2Object(media.publicId);
      } catch {
        console.error('Could not delete Backblaze B2 object for media:', id);
      }
    }

    // Delete from DB
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Media deleted securely' });
  } catch (error) {
    console.error('Delete Media API Error:', error);
    return NextResponse.json({ message: 'Server error during media deletion' }, { status: 500 });
  }
}

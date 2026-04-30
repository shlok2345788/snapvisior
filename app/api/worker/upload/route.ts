import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadImageBufferToB2 } from '@/lib/b2';

type UploadedFaceData = {
  fileName: string;
  descriptors: number[][];
};

function parseDescriptors(formData: FormData): UploadedFaceData[] {
  const raw = formData.get('descriptors');
  if (typeof raw !== 'string' || !raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as UploadedFaceData[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const eventId = formData.get('eventId') as string;
    const files = formData.getAll('files') as File[];
    const descriptorItems = parseDescriptors(formData);

    if (!eventId || files.length === 0) {
      return NextResponse.json({ message: 'Missing event ID or files' }, { status: 400 });
    }

    // Verify event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    if (descriptorItems.length !== files.length) {
      return NextResponse.json({ message: 'Face descriptors are required for every uploaded image.' }, { status: 400 });
    }

    let uploadedCount = 0;

    for (const [index, file] of files.entries()) {
      if (!file.name || !file.type.startsWith('image/')) continue;

      const descriptorItem = descriptorItems[index];
      if (!descriptorItem || !Array.isArray(descriptorItem.descriptors) || descriptorItem.descriptors.length === 0) {
        return NextResponse.json({ message: `No face detected in ${file.name}. Please upload images with at least one visible face.` }, { status: 400 });
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Upload to Backblaze B2 under an event-scoped object key
      const objectKey = `snapvisor/events/${eventId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      let uploaded;
      try {
        uploaded = await uploadImageBufferToB2(buffer, objectKey, file.type || 'image/jpeg');
      } catch (err: any) {
        console.error('Upload API Error:', err);
        if (err?.message && err.message.includes('Backblaze B2 bucket name is not configured')) {
          return NextResponse.json({ message: 'Backblaze B2 is not configured on the server. Set B2 environment variables.' }, { status: 503 });
        }
        return NextResponse.json({ message: 'Failed to upload image to storage.' }, { status: 500 });
      }
      
      // Record in database
      await prisma.media.create({
        data: {
          url: uploaded.key,
          publicId: uploaded.key,
          eventId: event.id,
          faces: descriptorItem.descriptors,
        }
      });
      
      uploadedCount++;
    }

    return NextResponse.json({
      uploaded: uploadedCount,
      message: 'All photos uploaded successfully.'
    });
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ message: 'Server error during upload' }, { status: 500 });
  }
}

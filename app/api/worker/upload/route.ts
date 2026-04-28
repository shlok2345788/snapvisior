import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { extractFaceEmbeddings } from '@/lib/ai';
import { uploadImageBufferToB2 } from '@/lib/b2';


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const eventId = formData.get('eventId') as string;
    const files = formData.getAll('files') as File[];

    if (!eventId || files.length === 0) {
      return NextResponse.json({ message: 'Missing event ID or files' }, { status: 400 });
    }

    // Verify event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    let uploadedCount = 0;
    let aiFailedCount = 0;

    for (const file of files) {
      if (!file.name || !file.type.startsWith('image/')) continue;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // AI Processing: Extract Face Embeddings
      const embeddingResult = await extractFaceEmbeddings(buffer);
      const faceEmbeddings = embeddingResult.error ? [] : embeddingResult.data;
      if (embeddingResult.error) {
        aiFailedCount++;
      }
      
      // Upload to Backblaze B2 under an event-scoped object key
      const objectKey = `snapvisor/events/${eventId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const uploaded = await uploadImageBufferToB2(buffer, objectKey, file.type || 'image/jpeg');
      
      // Record in database
      await prisma.media.create({
        data: {
          url: uploaded.key,
          publicId: uploaded.key,
          eventId: event.id,
          faces: faceEmbeddings.length > 0 ? faceEmbeddings : undefined
        }
      });
      
      uploadedCount++;
    }

    return NextResponse.json({
      uploaded: uploadedCount,
      aiProcessed: uploadedCount - aiFailedCount,
      aiFailed: aiFailedCount,
      message:
        aiFailedCount > 0
          ? 'Some photos uploaded without face embeddings because AI service was unavailable.'
          : 'All photos uploaded and processed successfully.'
    });
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ message: 'Server error during upload' }, { status: 500 });
  }
}

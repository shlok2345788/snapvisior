import { NextResponse } from 'next/server';
import { uploadImageBufferToB2, getB2SignedReadUrl } from '@/lib/b2';

type Body = {
  filename: string;
  contentType: string;
  data: string; // base64
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body || !body.filename || !body.contentType || !body.data) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const buffer = Buffer.from(body.data, 'base64');
    const key = `uploads/${Date.now()}-${body.filename}`;
    await uploadImageBufferToB2(buffer, key, body.contentType);
    const url = await getB2SignedReadUrl(key);
    return NextResponse.json({ key, url });
  } catch (err: any) {
    console.error('upload-image error', err);
    return NextResponse.json({ message: err?.message || 'Upload failed' }, { status: 500 });
  }
}

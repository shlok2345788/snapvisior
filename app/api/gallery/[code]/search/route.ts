import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return NextResponse.json(
    {
      message: `Photo search for event ${code} is coming soon.`,
    },
    { status: 503 }
  );
}

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const base = path.join(process.cwd(), 'public', 'models');
    const names = await fs.readdir(base);
    const files: Record<string, any> = {};

    for (const name of names) {
      const p = path.join(base, name);
      const stat = await fs.stat(p);
      if (name.endsWith('.json')) {
        try {
          const txt = await fs.readFile(p, 'utf8');
          const j = JSON.parse(txt);
          files[name] = {
            size: stat.size,
            isManifest: true,
            pathsType: Array.isArray((j as any).paths) ? 'array' : typeof (j as any).paths,
            weightsType: Array.isArray((j as any).weights) ? 'array' : typeof (j as any).weights,
            preview: Object.keys(j).slice(0, 5),
          };
        } catch (err) {
          files[name] = { size: stat.size, error: String(err) };
        }
      } else {
        // read first 64 bytes for a quick check
        try {
          const fh = await fs.open(p, 'r');
          const { buffer } = await fh.read({ length: 64, position: 0 });
          await fh.close();
          files[name] = { size: stat.size, isManifest: false, firstBytesBase64: buffer.toString('base64') };
        } catch (err) {
          files[name] = { size: stat.size, error: String(err) };
        }
      }
    }

    return NextResponse.json({ ok: true, files });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

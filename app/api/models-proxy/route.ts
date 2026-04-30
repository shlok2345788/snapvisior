import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const pathname = url.searchParams.get('path') || ''
    if (!pathname.startsWith('/models/')) {
      return NextResponse.json({ error: 'invalid path' }, { status: 400 })
    }

    const rel = pathname.replace(/^\/models\//, '')
    const full = path.join(process.cwd(), 'public', 'models', rel)

    const data = await fs.readFile(full)
    const text = data.toString('utf8')

    if (full.endsWith('.json')) {
      try {
        const parsed = JSON.parse(text)
        const out = Array.isArray(parsed) ? parsed : [parsed]
        return new NextResponse(JSON.stringify(out), {
          status: 200,
          headers: { 'content-type': 'application/json; charset=utf-8' },
        })
      } catch (e) {
        return new NextResponse(text, {
          status: 200,
          headers: { 'content-type': 'application/json; charset=utf-8' },
        })
      }
    }

    return new NextResponse(data, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { getImageContentType, getUploadFilePath } from '@/lib/uploadFiles';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const filePath = getUploadFilePath(filename);
  if (!filePath) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const file = await fs.readFile(filePath);
    return new Response(file, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': getImageContentType(filename)
      }
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import {
  getImageContentType,
  getLegacyProductUploadFilePath,
  getUploadFilePath
} from '@/lib/uploadFiles';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const candidatePaths = [
    getLegacyProductUploadFilePath(filename),
    getUploadFilePath(filename)
  ].filter((filePath): filePath is string => Boolean(filePath));

  for (const filePath of candidatePaths) {
    try {
      const file = await fs.readFile(filePath);
      return new Response(file, {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Type': getImageContentType(filename)
        }
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

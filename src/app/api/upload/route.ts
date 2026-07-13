import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // Authenticate the request
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if the uploaded file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Uploaded file is not an image' }, { status: 400 });
    }

    // Create target directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'product');
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate a unique filename to prevent collisions
    const fileExtension = path.extname(file.name) || '.png';
    const uniqueFilename = `${crypto.randomUUID()}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Convert to buffer and write to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Return the relative public path
    const publicUrl = `/images/product/${uniqueFilename}`;
    return NextResponse.json({ url: publicUrl });

  } catch (e: unknown) {
    console.error('Error uploading file:', e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Upload failed' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

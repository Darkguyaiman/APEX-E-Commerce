import { NextResponse } from 'next/server';
import { createContactMessage, getContactMessages, type ContactMessageInput } from '@/lib/db';
import { isAdminRequest } from '@/lib/adminAuth';

type MessagePayload = Record<string, unknown>;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal server error';
}

function parseMessagePayload(payload: MessagePayload): ContactMessageInput {
  const requiredFields = ['name', 'email', 'subject', 'message'];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === '') {
      throw new Error(`${field} is required`);
    }
  }

  const email = String(payload.email).trim();
  if (!email.includes('@') || !email.includes('.')) {
    throw new Error('Invalid email address');
  }

  return {
    name: String(payload.name).trim(),
    email,
    subject: String(payload.subject).trim(),
    message: String(payload.message).trim()
  };
}

// Public: anyone can submit a contact message
export async function POST(request: Request) {
  try {
    const payload = await request.json() as MessagePayload;
    const msg = parseMessagePayload(payload);
    const created = await createContactMessage(msg);

    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    console.error('Error creating contact message:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 400 });
  }
}

// Admin only: fetch all messages
export async function GET(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await getContactMessages();
    return NextResponse.json(messages);
  } catch (e: unknown) {
    console.error('Error fetching contact messages:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

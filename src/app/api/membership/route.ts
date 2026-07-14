import { NextResponse } from 'next/server';
import { createMembershipApplication, getMembershipApplications, type MembershipApplicationInput } from '@/lib/db';
import { isAdminRequest } from '@/lib/adminAuth';

type MembershipPayload = Record<string, unknown>;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal server error';
}

function parseMembershipPayload(payload: MembershipPayload): MembershipApplicationInput {
  const requiredFields = ['name', 'email', 'size', 'position', 'member_id'];

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
    size: String(payload.size).trim(),
    position: String(payload.position).trim(),
    member_id: String(payload.member_id).trim()
  };
}

// Public registration endpoint
export async function POST(request: Request) {
  try {
    const payload = await request.json() as MembershipPayload;
    const app = parseMembershipPayload(payload);
    const created = await createMembershipApplication(app);

    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    console.error('Error creating membership application:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 400 });
  }
}

// Admin only: fetch all memberships
export async function GET(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await getMembershipApplications();
    return NextResponse.json(applications);
  } catch (e: unknown) {
    console.error('Error fetching membership applications:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

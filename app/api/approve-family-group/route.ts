import { NextResponse } from 'next/server';
import { approveFamilyGroup } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { requestId } = body;
    const data = await approveFamilyGroup(requestId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error approving family group request', error);
    return NextResponse.json({ error: 'Failed to approve family group request' }, { status: 500 });
  }
}
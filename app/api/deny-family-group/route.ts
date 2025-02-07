import { NextResponse } from 'next/server';
import { denyFamilyGroup } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { requestId } = body;
    const data = await denyFamilyGroup(requestId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error denying family group request', error);
    return NextResponse.json({ error: 'Failed to deny family group request' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { joinFamilyGroup } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { familyName, recipientEmail, userId } = body;
    const message = await joinFamilyGroup(familyName, recipientEmail, userId);
    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error('Error soliciting join family group', error);
    return NextResponse.json({ error: 'Failed to solicit join family group' }, { status: 500 });
  }
}
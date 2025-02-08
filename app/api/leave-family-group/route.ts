import { NextResponse } from 'next/server';
import { leaveFamilyGroup } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, familyId } = body;
    await leaveFamilyGroup(userId, familyId);
    return NextResponse.json({status: 200});
  } catch (error) {
    console.error('Error leaving family group', error);
    return NextResponse.json({ error: 'Failed to leave family group' }, { status: 500 });
  }
}
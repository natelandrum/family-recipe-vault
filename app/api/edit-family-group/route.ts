import { NextResponse } from 'next/server';
import { editFamilyGroup } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { familyId, familyName } = body;
    const data = await editFamilyGroup(familyId, familyName);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error editing family group name', error);
    return NextResponse.json({ error: 'Failed to edit family group name' }, { status: 500 });
  }
}
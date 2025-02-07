import { NextResponse } from 'next/server';
import { addNewFamilyGroup } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { familyName, userId } = body;
    const data = await addNewFamilyGroup(familyName, userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding new family group', error);
    return NextResponse.json({ error: 'Failed to add new family group' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getEditFields } from '@/app/lib/data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipeId } = body;
    const editData = await getEditFields(recipeId);
    return NextResponse.json({ data: editData }, { status: 200 });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { deleteRecipe } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipeId } = body;
    await deleteRecipe(recipeId);
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
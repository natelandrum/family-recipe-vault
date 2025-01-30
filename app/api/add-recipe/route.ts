import { NextResponse } from 'next/server';
import { addRecipe } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, servings, description, instructions, mealType, imageUrl, created, userId, privacyStatus } = body;
    const recipeId = await addRecipe(name, servings, description, instructions, mealType, imageUrl, created, userId, privacyStatus);
    return NextResponse.json({ recipeId }, { status: 200 });
  } catch (error) {
    console.error('Error adding recipe:', error);
    return NextResponse.json({ error: 'Failed to add recipe' }, { status: 500 });
  }
}
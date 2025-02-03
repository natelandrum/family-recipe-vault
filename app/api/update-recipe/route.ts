import { NextResponse } from 'next/server';
import { updateRecipe } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, servings, description, instructions, mealType, privacyStatus, imageUrl, recipeId } = body;
    await updateRecipe(recipeId, name, servings, description, instructions, mealType, imageUrl, privacyStatus);
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error('Error adding recipe:', error);
    return NextResponse.json({ error: 'Failed to add recipe' }, { status: 500 });
  }
}
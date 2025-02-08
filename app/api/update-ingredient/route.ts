import { NextResponse } from 'next/server';
import { updateRecipeIngredients } from '@/app/lib/actions';

interface UpdateIngredientRequest {
  recipeId: number;
  ingredients: {
    ingredientName: string;
    quantity: number;
    unit: string;
    preparationMethod: string;
  }[];
}

export async function POST(req: Request) {
  try {
    const body: UpdateIngredientRequest = await req.json();
    const { recipeId, ingredients } = body;
    await updateRecipeIngredients(recipeId, ingredients);
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}
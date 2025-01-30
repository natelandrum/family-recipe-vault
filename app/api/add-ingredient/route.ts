import { NextResponse } from 'next/server';
import { addIngredient } from '@/app/lib/actions';

interface AddIngredientRequest {
    recipeId: number;
        ingredientName: string;
        quantity: number;
        unit: string;
        preparationMethod: string;
  }

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipeId, ingredients } = body;
    console.log('Adding ingredients:', recipeId, ingredients);
    await Promise.all(ingredients.map(async (ingredient: AddIngredientRequest) => {
      await addIngredient(recipeId, ingredient.ingredientName, ingredient.quantity, ingredient.unit, ingredient.preparationMethod);
    }));
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error adding recipe:', error);
    return NextResponse.json({ error: 'Failed to add recipe' }, { status: 500 });
  }
}
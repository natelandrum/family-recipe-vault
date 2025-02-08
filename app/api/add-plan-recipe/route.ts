import { NextResponse } from 'next/server';
import { addPlanRecipe } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan_id, recipe_id, total_servings, meal_type, day } = body;
    const plan_item_id = await addPlanRecipe(plan_id, recipe_id, total_servings, meal_type, day);
    return NextResponse.json({ plan_item_id }, { status: 200 });
  } catch (error) {
    console.error('Error adding recipe:', error);
    return NextResponse.json({ error: 'Failed to add recipe' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { addMealPlan } from '@/app/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, user_id } = body;
    const plan_id = await addMealPlan(date, user_id);
    return NextResponse.json({ plan_id }, { status: 200 });
  } catch (error) {
    console.error('Error adding meal plan:', error);
    return NextResponse.json({ error: 'Failed to add meal plan' }, { status: 500 });
  }
}
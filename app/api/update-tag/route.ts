import { NextResponse } from 'next/server';
import { updateRecipeTags } from '@/app/lib/actions';

interface UpdateTagRequest {
  recipeId: number;
  tags: {
    tagName: string;
  }[];
}

export async function POST(req: Request) {
  try {
    const body: UpdateTagRequest = await req.json();
    const { recipeId, tags } = body;
    await updateRecipeTags(recipeId, tags);
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}
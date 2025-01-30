import { NextResponse } from 'next/server';
import { addTag } from '@/app/lib/actions';

interface AddTagRequest {
  recipeId: number;
  tagName: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipeId, tags } = body;
    await Promise.all(tags.map(async (tag: AddTagRequest) => {
      await addTag(recipeId, tag.tagName);
    }));
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error adding recipe:', error);
    return NextResponse.json({ error: 'Failed to add recipe' }, { status: 500 });
  }
}
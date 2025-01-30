import { NextApiRequest, NextApiResponse } from 'next';
import { addTag } from '@/app/lib/actions';

interface AddTagRequest {
    recipeId: number;
    name: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { recipeId, tags } = req.body;
    tags.forEach(async (tag: AddTagRequest) => {
      await addTag(recipeId, tag.name);
    });
    } catch (error) {
    console.error('Error adding tags:', error);
      res.status(500).json({ error: 'Failed to add tags' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export {handler as POST};
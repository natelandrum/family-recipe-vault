import { NextApiRequest, NextApiResponse } from 'next';
import { addRecipe } from '@/app/lib/actions';
import axios from 'axios';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, servings, description, instructions, mealType, image, created, userId, privacyStatus } = req.body;
      if (image !== "") {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = async () => {
            const response = await axios.post('/api/image-upload', {file: reader.result});
            const imageUrl = response.data.url;
            const recipeId = await addRecipe(name, servings, description, instructions, mealType, imageUrl, created, userId, privacyStatus);
            if (recipeId) {
              res.status(200).json({ recipeId });
            } else {
              res.status(500).json({ error: 'Failed to add recipe' });

            }
        }
      }
    } catch (error) {
      console.error('Error adding recipe:', error);
      res.status(500).json({ error: 'Failed to add recipe' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export {handler as POST};
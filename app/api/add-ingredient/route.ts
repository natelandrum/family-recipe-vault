import { NextApiRequest, NextApiResponse } from 'next';
import { addIngredient } from '@/app/lib/actions';

interface AddIngredientRequest {
    recipeId: number;
    name: string;
    quantity: number;
    unit: string;
    preparationMethod: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { recipeId, ingredients } = req.body;
    ingredients.forEach(async (ingredient: AddIngredientRequest) => {
      await addIngredient(recipeId, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.preparationMethod);});
    } catch (error) {
    console.error('Error adding ingredients:', error);
      res.status(500).json({ error: 'Failed to add ingredients' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export {handler as POST};
import Image from 'next/image';
import { RecipeDetailIngredients } from '@/app/lib/definitions';
import AddToMealPlanButton from '@/app/components/menu-plan/AddToMealPlanButton';

type RecipeDetailsCardProps = {
  recipe: {
    recipe_id: number;
    recipe_image: string;
    recipe_name: string;
    author_name: string;
    meal_type: string;
    recipe_servings: number;
    recipe_description: string;
    recipe_instructions: string[];
  };
  detailIngredients: RecipeDetailIngredients[];
}

export const RecipeDetailsCard: React.FC<RecipeDetailsCardProps> = ({ recipe, detailIngredients }) => {
  const imageSrc = recipe.recipe_image || "/fallback-image.jpg";
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 gap-8">
      {/* Details & Image Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full m:w-4/5 lg:w-4/5 h-full flex flex-col lg:flex-row gap-8">
        {/* Details Section */}
        <div className='flex-1'>
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            {recipe.recipe_name}
          </h1>
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            <strong>By:</strong> {recipe.author_name}
          </h2>
          <ul className="space-y-4">
            <li><strong>Meal Type:</strong> {recipe.meal_type}</li>
            <li><strong>Servings:</strong> {recipe.recipe_servings}</li>
            <li><strong>Description:</strong> {recipe.recipe_description}</li>
          </ul>
        </div>
        {/* Image Section */}
        <div className='flex flex-1 justify-center items-center'>
          <Image
            src={imageSrc}
            alt={recipe.recipe_name}
            width={700}
            height={350}
            className="rounded-lg object-cover w-full h-auto max-h-[66vh]"
          />
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full m:w-4/5 lg:w-4/5 h-full flex flex-col justify-between">
        <strong>Ingredients:</strong>
        <div className="grid grid-cols-[1fr,1fr,2fr,2fr] gap-x-4 gap-y-2 mt-2 text-left border-t pt-2">
          {/* Column Headers */}
          <div className="font-bold text-center border-b pb-1">Qty</div>
          <div className="font-bold text-center border-b pb-1">Unit</div>
          <div className="font-bold border-b pb-1">Ingredient</div>
          <div className="font-bold border-b pb-1">Preparation</div>
         
          {/*Loop Ingredients */}
          {detailIngredients.map((ingredient, index) => (
          <div key={ingredient.ingredient_id || index} className="contents">
            <div className="text-center">{ingredient.quantity}</div>
            <div className="text-center">{ingredient.unit || ""}</div>
            <div className="text-left font-medium">{ingredient.ingredient_name}</div>
            <div className="text-left italic">{ingredient.preparation_method || ""}</div>
          </div>
        ))}
        </div>
        <ul className="space-y-4 pt-4">
          <li>
            <strong>Instructions:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              {recipe.recipe_instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </li>
        </ul>
        <div className="mt-4 flex justify-center items-center">
            <AddToMealPlanButton
                recipeId={recipe.recipe_id}
                recipeName={recipe.recipe_name}
            />
        </div>
            
      </div>
    </div>
  );
};
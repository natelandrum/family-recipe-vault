import Image from 'next/image';
import AddToMealPlanButton from '@/app/components/menu-plan/AddToMealPlanButton';

interface RecipeDetailsCardProps {
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
}

export const RecipeDetailsCard: React.FC<RecipeDetailsCardProps> = ({ recipe }) => {
  const imageSrc = recipe.recipe_image || "/fallback-image.jpg";
  
  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-center min-h-screen bg-gray-100 p-4 gap-8">
      {/* Image Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg lg:max-w-md h-full lg:flex-1 flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={recipe.recipe_name}
          width={800}
          height={450}
          className="rounded-lg object-cover w-full h-auto max-h-[66vh]"
        />
      </div>

      {/* Details Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg lg:max-w-md h-full lg:flex-1 flex flex-col justify-between">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          {recipe.recipe_name}
        </h1>
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          <strong>By:</strong> {recipe.author_name}
        </h2>
        <ul className="space-y-4">
          <li>
            <strong>Meal Type:</strong> {recipe.meal_type}
          </li>
          <li>
            <strong>Servings:</strong> {recipe.recipe_servings}
          </li>
          <li>
            <strong>Description:</strong> {recipe.recipe_description}
          </li>
          <li>
            <strong>Instructions:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              {recipe.recipe_instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </li>
        </ul>
        <div className="mt-4">
            <AddToMealPlanButton
                recipeId={recipe.recipe_id}
                recipeName={recipe.recipe_name}
            />
        </div>

      </div>
    </div>
  );
};
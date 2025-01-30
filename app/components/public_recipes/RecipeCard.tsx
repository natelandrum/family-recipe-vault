import { Recipe } from "@/app/lib/definitions";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold">{recipe.recipe_name}</h2>
      <p className="text-gray-600">{recipe.recipe_description}</p>
      {recipe.recipe_image && (
        <img
        src={recipe.recipe_image}
        alt={recipe.recipe_name}
        className="w-full h-48 object-cover rounded-md mt-2"
    />
      )}
    </div>
  );
}

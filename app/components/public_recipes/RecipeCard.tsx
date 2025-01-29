import { Recipe } from "@/app/lib/definitions";
import Image from "next/image";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold">{recipe.recipe_name}</h2>
      <p className="text-gray-600">{recipe.recipe_description}</p>
      {recipe.recipe_image && (
        <Image
        src="/path/to/spaghetti.jpg"
        alt={recipe.recipe_name}
        width={500}
        height={300}
    />
      )}
    </div>
  );
}

import { Recipe } from "@/app/lib/definitions";
import Link from "next/link";
import Image from "next/image";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="border hover:z-10 rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 bg-white relative">
      <Link href={`/recipe/${recipe.recipe_id}`}>
        <p className="flex items-center justify-center text-center text-lg font-bold line-clamp-2 h-14 mt-4">
          {recipe.recipe_name}
        </p>
        <div className="relative">
          {/* Apply 'peer' to the description */}
          <p className="text-gray-600 line-clamp-3 h-18 peer">
            {recipe.recipe_description}
          </p>
          {/* Tooltip with Arrow (Now with `z-10`) */}
          <div className="absolute w-full top-full mt-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-md opacity-0 peer-hover:opacity-100 transition-opacity duration-1000">
            {/* 🔺 Arrow at the top of the tooltip */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-900"></div>
            {recipe.recipe_description}
          </div>
        </div>
        {recipe.recipe_image && (
          <Image
            src={recipe.recipe_image}
            alt={recipe.recipe_name}
            width={400}
            height={400}
            className="w-full h-48 object-cover rounded-md mt-4"
          />
        )}
      </Link>
    </div>
  );
}

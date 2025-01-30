import RecipeCard from "./RecipeCard";
import { Recipe } from "@/app/lib/definitions";

interface RecipesListProps {
  recipes: Recipe[];
}

export default function RecipesList({ recipes }: RecipesListProps) {
  if (!recipes || recipes.length === 0) {
    return <p className="text-center">No recipes available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.recipe_id} recipe={recipe} />
      ))}
    </div>
  );
}

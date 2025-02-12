import RecipeCard from "../public_recipes/RecipeCard";
import { getFeaturedRecipes } from "@/app/lib/data";

export default async function FeaturedRecipes() {
  const recipes = await getFeaturedRecipes();

  return (
    <section className="py-16 bg-[var(--color-primary)] text-center">
      <h2 className="text-5xl text-[var(--color-accent)] font-bold mb-8">
        Featured Recipes
      </h2>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div
            key={recipe.recipe_id}>
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
      <div className="mt-8">
          <a
            href="/recipes"
            className="bg-[var(--color-dark)] hover:bg-[var(--color-accent)] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
          >
            See More
          </a>
        </div>
    </section>
  );
}

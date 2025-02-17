import { fetchRecipeWithAuthorById, checkRecipeAccess, getRecipeDetailIngredients } from "@/app/lib/data";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { RecipeDetailsCard } from "@/app/components/recipe/RecipeDetailsCard";
import { getServerSession } from "next-auth";
import { getUser } from "@/app/lib/actions";
import { RecipeDetailIngredients } from "@/app/lib/definitions";

export const metadata: Metadata = {
  title: "Recipe Details",
  description: "All you need to know to make a yummy dish.",
};

export default async function RecipePage(props: { params: Promise<{ recipe_id: string }> }) {
  // Parse the recipe_id from params
  const { recipe_id } = await props.params;
  if (!recipe_id) {
    notFound();
  }
  const recipeIdNumber = parseInt(recipe_id, 10);
  if (isNaN(recipeIdNumber)) {
    notFound();
  }

  // Fetch the recipe details (with its author)
  const recipe = await fetchRecipeWithAuthorById(recipe_id);
  if (!recipe) {
    notFound();
  }

  const detailIngredients: RecipeDetailIngredients[] = await getRecipeDetailIngredients(recipeIdNumber);
  
  // Check user session and access rights
  let hasAccess = false;
  const session = await getServerSession();

  if (session?.user?.email) {
    const user = await getUser(session.user.email);
    const userId = user?.id;
    if (userId) {
      hasAccess = await checkRecipeAccess(recipeIdNumber, userId);
      if (!hasAccess) {
        redirect("/profile");
      }
    }
  } else {
    // When user is not logged in, verify access based solely on the recipe.
    hasAccess = await checkRecipeAccess(recipeIdNumber);
    if (!hasAccess) {
      redirect("/profile");
    }
  }

  // Provide a fallback image if no recipe image is available
  const recipeWithImage = {
    ...recipe,
    recipe_image: recipe.recipe_image || "/fallback-image.jpg",
  };

  return (
    <div className="flex justify-center mx-auto w-2/3 p-6 items-center mt-6">
      <RecipeDetailsCard recipe={recipeWithImage} detailIngredients={detailIngredients} />
    </div>
  );
}

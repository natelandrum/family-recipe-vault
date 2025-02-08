import { fetchRecipeWithAuthorById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { RecipeDetailsCard } from "@/app/components/recipe/RecipeDetailsCard";

// import Image from 'next/image';

// import AddToMealPlanButton from "@/app/components/menu-plan/AddToMealPlanButton";

export const metadata: Metadata = {
    title: "Recipe Details",
    description: "All you need to know to make a yummy dish.",
};

// interface PageProps {
//     params: {
//         recipe_id: number;
//     };
// }

export default async function RecipePage(props: { params: Promise<{ recipe_id: string }> } ) {
    const params = await props.params;
    const recipe_id = params.recipe_id;
    
    if (!recipe_id) {
        notFound();
    }

    const recipe = await fetchRecipeWithAuthorById(recipe_id);

    console.log(recipe)
    const recipeWithImage = {
        ...recipe,
        recipe_image: recipe.recipe_image || "/fallback-image.jpg"
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <RecipeDetailsCard recipe={recipeWithImage} />
    </div>

    );
}
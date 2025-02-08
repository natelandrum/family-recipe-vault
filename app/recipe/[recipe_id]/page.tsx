import { fetchRecipeWithAuthorById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from 'next/image';
import AddToMealPlanButton from "@/app/components/menu-plan/AddToMealPlanButton";

export const metadata: Metadata = {
    title: "Recipe Details",
    description: "All you need to know to make a yummy dish.",
};

export default async function RecipePage(props: { params: Promise<{ recipe_id: string }> } ) {
    const params = await props.params;
    const recipe_id = params.recipe_id;
    
    if (!recipe_id) {
        notFound();
    }

    const recipe = await fetchRecipeWithAuthorById(recipe_id);
    
    return (
        <div className="flex flex-col lg:flex-row items-stretch justify-center min-h-full bg-gray-100 p-4 gap-8">
    {/* Image Section */}
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md lg:flex-1 h-auto flex items-center justify-center">
        <Image
            width={800}
            height={450}
            layout = "intrinsic"
            src={recipe.recipe_image || "/fallback-image.jpg"}
            alt={recipe.recipe_name}
            className="rounded-lg object-cover w-full max-h-80 md:max-h-[450px] lg:max-h-[600px] h-auto"
        />
    </div>

    {/* Details Section */}
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md lg:flex-1 flex flex-col justify-between h-auto">
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
                    {recipe.recipe_instructions.map((instruction: string, index: number) => (
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
}




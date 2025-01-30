import { fetchRecipeWithAuthorById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from 'next/image';

// import { RecipeWithAuthor } from "@/app/lib/definitions";

// import { CldImage } from 'next-cloudinary';

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

    return (
        <div className="flex flex-col lg:flex-row items-stretch justify-center min-h-screen bg-gray-100 p-4 gap-8">
    {/* Image Section */}
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md lg:flex-1 h-[66vh] flex items-center justify-center">
        <Image
            width={800}
            height={450}
            src="https://res.cloudinary.com/dz4hakm5w/image/upload/v1738013834/apple-pie_p4k2q6.jpg"
            alt="Picture of pie"
            className="rounded-lg object-cover w-full h-full"
        />
    </div>

    {/* Details Section */}
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md lg:flex-1 h-[66vh] flex flex-col justify-between">
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
    </div>
</div>


    );
}




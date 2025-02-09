import { getFamilyGroupById, getFamilyRecipes } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { FamilyGroupDetailsCard } from "@/app/components/family/FamilyGroupDetailsCard";
import { RecipeList } from "@/app/components/family/RecipeList";

export const metadata: Metadata = {
    title: "Family Group Details",
    description: "Information about the family group.",
};

export default async function FamilyGroupPage({ params: paramsPromise }: { params: Promise<{ family_id: string }> }) {
    const params = await paramsPromise;
    const familyId = parseInt(params.family_id, 10);

    if (isNaN(familyId)) {
        notFound();
    }

    const familyGroup = await getFamilyGroupById(familyId);

    if (!familyGroup) {
        notFound();
    }

    const familyRecipes = await getFamilyRecipes(familyId);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <FamilyGroupDetailsCard familyGroup={familyGroup} />

            {familyRecipes.length > 0 ? (
                <div className="mt-8 w-full max-w-4xl">
                    <h2 className="text-2xl font-bold mb-4">Your Family Recipes:</h2>
                    <RecipeList recipes={familyRecipes} />
                </div>
            ) : (
                <p className="text-gray-800 m-8">No recipes found for this family group.</p>
            )}
        </div>
    );
}
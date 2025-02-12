import {
  getFamilyGroupById,
  getFamilyGroupsByUserId,
  getRecipesByFamilyId,
} from "@/app/lib/data";
import { notFound, redirect } from "next/navigation";
import { FamilyGroupDetailsCard } from "@/app/components/family/FamilyGroupDetailsCard";
import { Metadata } from "next";
import RecipeList from "@/app/components/public_recipes/RecipesList";
import { getServerSession } from "next-auth";
import { getUser } from "@/app/lib/actions";

export const metadata: Metadata = {
  title: "Family Recipes",
  description: "Your family's culinary creations, all in one place.",
};

export default async function FamilyGroupPage(props: {
  params: Promise<{ family_id: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await getUser(session.user.email);
  if (!user) {
    redirect("/signin");
  }

  const { family_id } = await props.params;

  // Convert family_id to a number safely
  const familyId = parseInt(family_id);
  if (isNaN(familyId)) {
    notFound();
  }

  // Fetch data **concurrently**
  const [familyGroups, familyGroup, familyRecipes] = await Promise.all([
    getFamilyGroupsByUserId(user.id),
    getFamilyGroupById(familyId),
    getRecipesByFamilyId(familyId),
  ]);

  // Check if user is part of the requested family group
  const hasAccess = familyGroups.some((f) => Number(f.family_id) === familyId);

  if (!hasAccess) {
    redirect("/profile");
  }

  // If the family group doesn't exist, return a 404
  if (!familyGroup) {
    notFound();
  }

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="container mx-auto p-4">
        <FamilyGroupDetailsCard familyGroup={familyGroup} />
        <RecipeList recipes={familyRecipes} />
      </div>
    </div>
  );
}

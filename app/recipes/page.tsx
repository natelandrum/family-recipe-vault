"use client";

import RecipesList from "@/app/components/public_recipes/RecipesList";
import { getRecipes } from "@/app/lib/actions";
import { Recipe } from "@/app/lib/definitions";
import { useState, useEffect } from "react";
import PlaceHolderContainer from "../components/ui/placeHolderContainer";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  if (loading) {
    return <PlaceHolderContainer />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Recipes</h1>
      <RecipesList recipes={recipes} />
    </div>
  );
}

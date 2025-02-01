"use client";

import React from "react";
import { Recipe } from "@/app/lib/definitions";
import Link from "next/link";

interface RecipeListProps {
    recipes: Recipe[];
}
const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
    return (
        <section className="p-4 bg-gray-100 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-2">Recipe List</h2>
            {recipes.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {recipes.map(recipe => (
                        <Link key={recipe.recipe_id}href={`../../recipe/${recipe.recipe_id}`}>
                        <li key={recipe.recipe_id} className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-xl font-semibold">{recipe.recipe_name}</h3>
                            <p>{recipe.recipe_description}</p>
                        </li>
                        </Link>

                    ))}
                </ul>
            ) : (
                <p>No recipes found.</p>
            )}
        </section>
    );
};

export default RecipeList;
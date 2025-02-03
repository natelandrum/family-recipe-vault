"use client";
import RecipeForm from "@/app/components/profile/RecipeForm";
import React, { useState } from "react";
import { Recipe } from "@/app/lib/definitions";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";

interface RecipeListProps {
  recipes: Recipe[];
  userId: number;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, userId }) => {
  const [mode, setMode] = useState<"view" | "add" | "edit" | "editReady">("view");
  const [recipeList, setRecipeList] = useState<Recipe[]>(recipes);
  const [recipe, setRecipe] = useState();

  const handleRecipeSubmit = (newRecipe: Recipe) => {
    if (mode === "editReady") {
      setRecipeList((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.recipe_id === newRecipe.recipe_id ? newRecipe : recipe
        )
      );
    } else {
      setRecipeList((prevRecipes) => [...prevRecipes, newRecipe]);
    }
    setMode("view");
  };

  const handleRecipeDelete = async (recipeId: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;
    const deleteResponse = await fetch("/api/delete-recipe", {
      method: "POST",
      body: JSON.stringify({ recipeId }),
    });
    if (!deleteResponse.ok) {
      console.error("Failed to delete recipe");
      return;
    }
    setRecipeList((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.recipe_id !== recipeId)
    );
  };

  const handleRecipeEdit = async (recipeId: number) => {
    const response = await fetch("/api/recipe", {
      method: "POST",
      body: JSON.stringify({ recipeId }),
    });
    if (!response.ok) {
      console.error("Failed to fetch recipe");
      return;
    }
    const recipe = await response.json();
    console.log(recipe);
    if (recipe) {
      setRecipe(recipe.data);
      setMode("editReady");
    }
  };

  return (
    <>
      {(mode === "view" || mode === "add") && (
        <button
          type="button"
          className={`${
            mode === "add"
              ? "bg-red-600 hover:bg-red-800"
              : "bg-blue-600 hover:bg-blue-800"
          } mr-4 text-white py-2 px-4 text-md rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mb-2`}
          onClick={() => setMode(mode === "view" ? "add" : "view")}
        >
          {mode === "add" ? "Cancel" : "Add Recipe"}
        </button>
      )}
      {mode !== "add" && (
        <button
          type="button"
          className={`${
            mode === "edit" || mode === "editReady"
              ? "bg-red-600 hover:bg-red-800"
              : "bg-orange-600 hover:bg-orange-800"
          } text-white py-2 px-4 text-md rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mb-2`}
          onClick={() => setMode(mode === "view" ? "edit" : "view")}
        >
          {mode === "edit" || mode === "editReady" ? "Cancel" : "Edit Recipe"}
        </button>
      )}
      {(mode === "view" || mode === "edit") && (
        <section className="p-6 bg-gray-100 rounded-lg mb-6 col-span-3 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Recipe List</h2>
          {recipeList.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipeList.map((recipe) => (
                <li
                  key={recipe.recipe_id}
                  className="bg-white overflow-hidden p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 h-full flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <Link href={`/recipe/${recipe.recipe_id}`} className="flex-grow">
                      <h3 className="text-3xl font-semibold text-center">{recipe.recipe_name}</h3>
                    </Link>
                    {mode === "edit" && (
                      <div className="flex z-10">
                        <IconButton
                          aria-label="edit"
                          size="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleRecipeEdit(recipe.recipe_id);
                          }}
                        >
                          <EditIcon fontSize="large" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleRecipeDelete(recipe.recipe_id);
                          }}
                        >
                          <DeleteIcon fontSize="large" color="error" />
                        </IconButton>
                      </div>
                    )}
                  </div>
                  <Link href={`/recipe/${recipe.recipe_id}`} className="flex-grow flex flex-col justify-center items-center">
                    <Image
                      src={recipe.recipe_image || "/default-recipe-image.webp"}
                      alt={recipe.recipe_name}
                      width={400}
                      height={400}
                      className="rounded-lg mb-2 h-52 w-80 object-cover"
                    />
                    <p className="line-clamp-3 text-gray-700 mt-auto">
                      {recipe.recipe_description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No recipes found.</p>
          )}
        </section>
      )}
      {mode === "add" && (
        <RecipeForm userId={userId} mode={mode} onSubmit={handleRecipeSubmit} />
      )}
      {mode === "editReady" && (
        <RecipeForm
          mode={mode}
          userId={userId}
          onSubmit={handleRecipeSubmit}
          existingRecipe={recipe}
        />
      )}
    </>
  );
};

export default RecipeList;

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import RecipeForm from "@/app/components/profile/RecipeForm";
import React, { useState } from "react";
import { Recipe } from "@/app/lib/definitions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import RecipeCard from "../public_recipes/RecipeCard";
import SortDropdown from "../searchSort/sortDropdown";
import SearchBar from "../searchSort/searchBar";

interface RecipeListProps {
  recipes: Recipe[];
  userId: number;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, userId }) => {
  const [mode, setMode] = useState<"view" | "add" | "edit" | "editReady">("view");
  const [recipeList, setRecipeList] = useState<Recipe[]>(recipes);
  const [recipe, setRecipe] = useState();
  const [sortBy, setSortBy] = useState("name");
  const [selectedMealType, setSelectedMealType] = useState("All");

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
  
  // Handle Sorting
  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
    const sortedRecipes = [...recipeList].sort((a, b) => {
      if (sortBy === "name") return a.recipe_name.localeCompare(b.recipe_name);
      if (sortBy === "date")
        return new Date(b.created_on).getTime() - new Date(a.created_on).getTime();
      if (sortBy === "meal_type") return a.meal_type.localeCompare(b.meal_type);
      return 0;
    });
    setRecipeList(sortedRecipes);
  };

  // Handle Meal Type Filtering
  const handleMealTypeFilter = (mealType: string) => {
    setSelectedMealType(mealType);
    if (mealType === "All") {
      setRecipeList(recipes);
    } else {
      setRecipeList(recipes.filter((recipe) => recipe.meal_type === mealType));
    }
  };

  // Handle Search Logic
  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setRecipeList(recipes);
    } else {
      setRecipeList(
        recipes.filter((recipe) =>
          recipe.recipe_name.toLowerCase().includes(query.toLowerCase())
        )
      );
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
              : "bg-accent hover:bg-primary text-white hover:text-black"
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
              : "bg-dark hover:bg-highlight text-white hover:text-black"
          } text-white py-2 px-4 text-md rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mb-2`}
          onClick={() => setMode(mode === "view" ? "edit" : "view")}
        >
          {mode === "edit" || mode === "editReady" ? "Cancel" : "Edit Recipe"}
        </button>
      )}
      {(mode === "view" || mode === "edit") && (
        <section className="p-6 bg-gray-100 rounded-lg mb-6 col-span-3 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Recipe List</h2>
          <div className="flex justify-between mb-4">
            <SearchBar onSearch={handleSearch} />
            <SortDropdown
              onSortChange={handleSort}
              onMealTypeChange={handleMealTypeFilter}
            />
          </div>
          {recipeList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recipeList.map((recipe) => (
                <div key={recipe.recipe_id} className="relative">
                  <RecipeCard recipe={recipe} />
                  {mode === "edit" && (
                    <div className="flex z-20 top-0 right-0 absolute">
                      <IconButton
                        aria-label="edit"
                        size="medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleRecipeEdit(recipe.recipe_id);
                        }}
                      >
                        <EditIcon fontSize="medium" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        size="medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleRecipeDelete(recipe.recipe_id);
                        }}
                      >
                        <DeleteIcon fontSize="medium" color="error" />
                      </IconButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
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

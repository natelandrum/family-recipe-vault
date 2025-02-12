"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import SearchBar from "../searchSort/searchBar";
import SortDropdown from "../searchSort/sortDropdown";
import RecipeCard from "./RecipeCard";
import { Recipe } from "@/app/lib/definitions";
import { motion } from "framer-motion";

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [sortBy, setSortBy] = useState("name");
  const [selectedMealType, setSelectedMealType] = useState("All");

  // Handle Search
  const handleSearch = (query: string) => {
    const filtered = recipes.filter((recipe) =>
      recipe.recipe_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  // Handle Sorting
  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
    if (sortBy === "all") {
      setFilteredRecipes(recipes);
    } else {
    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
      if (sortBy === "name") return a.recipe_name.localeCompare(b.recipe_name);
      if (sortBy === "date") return new Date(b.created_on).getTime() - new Date(a.created_on).getTime();
      return 0;
    });
    setFilteredRecipes(sortedRecipes);
  }
  };

  // Handle Meal Type Filtering
  const handleMealTypeFilter = (mealType: string) => {
    setSelectedMealType(mealType);
    if (mealType === "All") {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(recipes.filter((recipe) => recipe.meal_type === mealType));
    }
  };

  return (
    <div>
      <div className="flex justify-between m-4">
        <SearchBar onSearch={handleSearch} />
        <SortDropdown onSortChange={handleSort} onMealTypeChange={handleMealTypeFilter} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
        {filteredRecipes.map((recipe) => (
          <motion.div
            key={recipe.recipe_id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <RecipeCard key={recipe.recipe_id} recipe={recipe} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

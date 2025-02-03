/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import SearchBar from "./../searchSort/searchBar";
import SortDropdown from "./../searchSort/sortDropdown";
import RecipeCard from "./RecipeCard";
import { Recipe } from "@/app/lib/definitions";
import { motion } from "framer-motion";

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [sortBy, setSortBy] = useState("name");

  if (!recipes || recipes.length === 0) {
    return <p className="text-center">No recipes available.</p>;
  }

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
    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
      if (sortBy === "name") return a.recipe_name.localeCompare(b.recipe_name);
      if (sortBy === "date") return new Date(b.created_on).getTime() - new Date(a.created_on).getTime();
      if (sortBy === "privacy_status") return a.privacy_status.localeCompare(b.privacy_status);
      if (sortBy === "meal_type") return a.meal_type.localeCompare(b.meal_type);
      return 0;
    });
    setFilteredRecipes(sortedRecipes);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <SearchBar  onSearch={handleSearch}/>
        <SortDropdown onSortChange={handleSort} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <motion.div
            key={recipe.recipe_id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <RecipeCard recipe={recipe} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client"
import { Recipe } from "@/app/lib/definitions";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const maxLength = 90;

  return (
    <div className="border hover:z-10 h-full rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 bg-white relative">
      <Link href={`/recipe/${recipe.recipe_id}`}>
        <h3 className="text-3xl flex items-center justify-center text-center font-bold line-clamp-2 h-14 my-3">
          {recipe.recipe_name}
        </h3>

        <div
          className={`relative overflow-hidden transition-all duration-500 ${
            isExpanded ? "h-auto" : "h-20"
          }`}
        >
          <p className="text-gray-600 recipe-description">
            {isExpanded
              ? recipe.recipe_description
              : recipe.recipe_description.slice(0, maxLength)}
            {recipe.recipe_description.length > maxLength && (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  toggleDescription();
                }}
                className="text-[var(--color-dark)] cursor-pointer ml-2"
              >
                {isExpanded ? "See less" : "... See more"}
              </span>
            )}
          </p>
        </div>

        {recipe.recipe_image && (
          <div className={`mt-4 transition-all duration-500 ${isExpanded ? 'mt-6' : 'mt-4'}`}>
            <Image
              src={recipe.recipe_image}
              alt={recipe.recipe_name}
              width={400}
              height={400}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
      </Link>
    </div>
  );
}
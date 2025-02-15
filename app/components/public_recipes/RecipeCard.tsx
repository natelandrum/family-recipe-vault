"use client";
import { Recipe } from "@/app/lib/definitions";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Function to check if text overflows
  const checkOverflow = () => {
    if (textRef.current) {
      setIsOverflowing(
        textRef.current.scrollHeight > textRef.current.clientHeight
      );
    }
  };

  // Run on mount and when the window resizes
  useEffect(() => {
    checkOverflow(); // Initial check

    window.addEventListener("resize", checkOverflow); // Listen for resize events
    return () => window.removeEventListener("resize", checkOverflow); // Cleanup
  }, []); // Empty dependency array ensures it runs only once on mount

  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="border hover:z-10 h-full rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 bg-white relative">
      <Link href={`/recipe/${recipe.recipe_id}`}>
        <h3 className="text-4xl sm:text-3xl md:text-2xl xl:text-3xl flex justify-center items-center text-center font-bold min-h-20 max-h-20 line-clamp-2">
          {recipe.recipe_name}
        </h3>

        {/* Description Container */}
        <div
          className={`relative transition-all duration-500 ${
            isExpanded ? "h-auto" : "h-[4.5rem] overflow-hidden"
          }`}
        >
          <p
            ref={textRef}
            className={`text-gray-600 ${
              isExpanded ? "" : "line-clamp-2 text-ellipsis"
            }`}
          >
            {recipe.recipe_description}
          </p>

          {/* Only show "See more" if the text is actually overflowing */}
          {isOverflowing && (
            <span
              onClick={toggleDescription}
              className="block text-[var(--color-dark)] cursor-pointer mt-1"
            >
              {isExpanded ? "See less" : "See more"}
            </span>
          )}
        </div>

        {/* Recipe Image */}
        {recipe.recipe_image && (
          <div
            className={`mt-4 transition-all duration-500 ${
              isExpanded ? "mt-6" : "mt-4"
            }`}
          >
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

"use server";

import { sql } from "@vercel/postgres";
import { Recipe } from "./definitions";


export async function getRecipesByUser(userId: number): Promise<Recipe[]> {
    try {
        const response = await sql`SELECT * FROM recipe WHERE user_id = ${userId}`;
        return response.rows as Recipe[];
    } catch (error) {
        console.error("Error fetching recipes by user:", error);
        throw new Error("Failed to fetch recipes by user");
    }
}

export async function getRecipeTags(recipeId: number): Promise<string[]> {
    try {
        const response = await sql`
        SELECT tag_name FROM tag 
        JOIN recipe_tag 
        ON tag.tag_id = recipe_tag.tag_id 
        WHERE recipe_id = ${recipeId}`;
        return response.rows.map(row => row.tag_name);
    } catch (error) {
        console.error("Error fetching recipe tags:", error);
        throw new Error("Failed to fetch recipe tags");
    }
}

export async function getRecipeIngredients(recipeId: number): Promise<string[]> {
    try {
        const response = await sql`
        SELECT ingredient_name FROM ingredient 
        JOIN recipe_ingredient 
        ON ingredient.ingredient_id = recipe_ingredient.ingredient_id 
        WHERE recipe_id = ${recipeId}`;
        return response.rows.map(row => row.ingredient_name);
    } catch (error) {
        console.error("Error fetching recipe ingredients:", error);
        throw new Error("Failed to fetch recipe ingredients");
    }
}
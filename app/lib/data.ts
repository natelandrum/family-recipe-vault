"use server";

import { sql } from "@vercel/postgres";
import { Family, Ingredient, Recipe, RecipeWithAuthor } from "./definitions";


export async function getRecipesByUser(userId: number): Promise<Recipe[]> {
    try {
        const response = await sql`SELECT * FROM recipe WHERE user_id = ${userId}`;
        return response.rows as Recipe[];
    } catch (error) {
        console.error("Error fetching recipes by user:", error);
        throw new Error("Failed to fetch recipes by user");
    }
}

export async function getRecipeById(recipeId: number): Promise<Recipe> {
    try {
        const response = await sql`SELECT * FROM recipe WHERE recipe_id = ${recipeId}`;
        return response.rows[0] as Recipe;
    } catch (error) {
        console.error("Error fetching recipe by id:", error);
        throw new Error("Failed to fetch recipe by id");
    }
}

export async function getRecipeTags(recipeId: number): Promise<{ tagName: string }[]> {
    try {
        const response = await sql`
        SELECT tag_name FROM tags
        JOIN recipe_tags 
        ON tags.tag_id = recipe_tags.tag_id 
        WHERE recipe_id = ${recipeId}`;
        return response.rows.map(row => ({ tagName: row.tag_name }));
    } catch (error) {
        console.error("Error fetching recipe tags:", error);
        throw new Error("Failed to fetch recipe tags");
    }
}

export async function getRecipeIngredients(recipeId: number): Promise<Ingredient[]> {
    try {
        const response = await sql`
        SELECT ingredients.ingredient_id, ingredient_name, quantity, unit, preparation_method FROM ingredients 
        JOIN recipe_ingredients 
        ON ingredients.ingredient_id = recipe_ingredients.ingredient_id 
        WHERE recipe_id = ${recipeId}`;
        return response.rows.map(row => {
            return {
                ingredient_id: row.ingredient_id,
                ingredient_name: row.ingredient_name,
                quantity: row.quantity,
                unit: row.unit,
                preparation_method: row.preparation_method
            };
        })
    } catch (error) {
        console.error("Error fetching recipe ingredients:", error);
        throw new Error("Failed to fetch recipe ingredients");
    }
}

export async function fetchRecipeWithAuthorById( recipe_id: string) {
    try {
        const data = await sql<RecipeWithAuthor>`
            SELECT 
                recipe.*, 
                users.name AS author_name
            FROM 
                recipe
            JOIN 
                users 
            ON 
                recipe.user_id = users.id
            WHERE 
                recipe.recipe_id = ${recipe_id}; 
        `;
        const recipe = data.rows;
        return recipe[0] as RecipeWithAuthor;
    } catch (error) {
        console.error('Databae Error:', error);
        throw new Error('Failed to fecth recipe details.');
    }
}

export async function getFamilyGroupByUser(userId: number): Promise<Family[]> {
    try {
        const response = await sql`
            SELECT family.family_id, family.family_name
            FROM family
            JOIN user_family_group 
            ON family.family_id = user_family_group.family_id
            WHERE user_family_group.id = ${userId}`;
        return response.rows as Family[];
    } catch (error) {
        console.error("Error fetching family group by user:", error);
        throw new Error("Failed to fetch family group by user");
    }
}

export async function getEditFields(recipeId: number) {
    try {
        const recipe = await getRecipeById(recipeId);
        const tags = await getRecipeTags(recipeId);
        const ingredients = await getRecipeIngredients(recipeId);
        return {
            recipe,
            ingredients,
            tags            
        }
    } catch (error) {
        console.error("Error fetching edit fields:", error);
        throw new Error("Failed to fetch edit fields");
    }
}
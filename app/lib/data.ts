"use server";

import { sql } from "@vercel/postgres";
import { Family, MealPlan, Recipe, RecipeWithAuthor, MealPlanRecipeData } from "./definitions";


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

export async function getMealPlansByUserId(id: number): Promise<MealPlan[]> {
    try {
        const response = await sql`
        SELECT * FROM meal_plan WHERE user_id = ${id};`;
        return response.rows as MealPlan[];
    } catch (error) {
        console.error("Error fetching recipe ingredients:", error);
        throw new Error("Failed to fetch recipe ingredients");
    }
}

export async function getMealPlanRecipesByPlanID(plan_id: number): Promise<MealPlanRecipeData[]> {
    try {
        const response = await sql`
        SELECT 
            mp.date AS start_date,
            rp.recipe_id,
            rp.plan_item_id,
            r.recipe_name,
            r.recipe_servings,
            rp.total_servings,
            rp.meal_type,
            rp.day
        FROM meal_plan mp
        JOIN meal_plan_recipe rp ON mp.plan_id = rp.plan_id
        JOIN recipe r ON rp.recipe_id = r.recipe_id
        WHERE mp.plan_id = ${plan_id}
        ORDER BY rp.day ASC, mp.date DESC;`;
        return response.rows as MealPlanRecipeData[];
    } catch (error) {
        console.error("Error fetching recipe ingredients:", error);
        throw new Error("Failed to fetch recipe ingredients");
    }
}

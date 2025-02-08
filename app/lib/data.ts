"use server";

import { sql } from "@vercel/postgres";
import { Family, FamilyRequest, Ingredient, Recipe, RecipeWithAuthor, MealPlan, MealPlanRecipeData } from "./definitions";

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

export async function getFamilyGroupById(familyId: number): Promise<Family> {
    try {
        const response = await sql`
            SELECT family_id, family_name FROM family WHERE family_id = ${familyId}`;
        
        // Verifica que se obtuvieron resultados antes de intentar acceder
        if (response.rows.length === 0) {
            throw new Error("No family found");
        }
        
        const family = response.rows[0];
        
        // Asegúrate de que ambos valores estén presentes y del tipo adecuado
        return { 
            family_id: String(family.family_id),  // Convertir a string si es necesario
            family_name: family.family_name 
        };
        
    } catch (error) {
        console.error("Error fetching family group by ID:", error);
        throw new Error("Failed to fetch family group by ID");
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

export async function getFamilyRequestsByUserId(userId: number): Promise<FamilyRequest[]> {
    try {
        const response = await sql`
            SELECT request_id, user_id, name, fr.family_id, family_name
            FROM family_requests as fr
            JOIN family as f
            ON fr.family_id = f.family_id
            JOIN users as u
            ON fr.user_id = u.id
            WHERE recipient_user_id = ${userId} AND status = 'pending'`;
        return response.rows as FamilyRequest[];
    } catch (error) {
        console.error("Error fetching notifications by user:", error);
        throw new Error("Failed to fetch notifications by user");
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

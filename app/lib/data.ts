import { sql } from "@vercel/postgres";
import { Recipe } from "@/app/lib/definitions";


export async function getRecipes(): Promise<Recipe[]> {
    try {
        const result = await sql`SELECT * FROM recipe ORDER BY created_on DESC`;
        return result.rows.map(row => ({
            recipe_id: row.recipe_id,
            recipe_name: row.recipe_name,
            recipe_servings: row.recipe_servings,
            recipe_description: row.recipe_description,
            recipe_instructions: row.recipe_instructions,
            meal_type: row.meal_type,
            recipe_image: row.recipe_image || null,
            created_on: row.created_on,
            user_id: row.user_id,
        })) as Recipe[];
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return [];
    }
}
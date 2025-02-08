"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { MealType, PrivacyStatus, Recipe, User } from "./definitions";


const passwordValidation = new RegExp(
  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/
);

const AuthenticationSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(passwordValidation, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
});

const RegistrationSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(passwordValidation, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
    confirmPassword: z.string().min(8, { message: "Password confirmation must be at least 8 characters" }),
})
.refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const RecipeSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    servings: z.number().int().min(1, { message: "Servings must be at least 1" }),
    description: z.string().min(1, { message: "Description is required" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
    instructions: z.array(z.string().min(1, { message: "Instruction is required" }))
    .min(1, { message: "At least one instruction is required" }),
    mealType: z.nativeEnum(MealType, { message: "Invalid meal type" }),
    image: z.object({ 
        name: z.string(), 
        type: z.string(),
        size: z.number().int().min(1),
    })
    .optional().or(z.literal('')),
    privacyStatus: z.nativeEnum(PrivacyStatus, { message: "Invalid privacy status" }),
    ingredients: z.array(z.object({
        name: z.string().min(1, { message: "Ingredient name is required" }),
        quantity: z.number().min(0.01, { message: "Quantity must be at least 0.01" }),
        unit: z.string().min(1, { message: "Unit is required" }),
        preparationMethod: z.string().optional().or(z.literal('')),
    })),
    tags: z.array(z.string().min(1, { message: "Tag name is required" })),
});

const FamilyNameSchema = z.object({
    familyName: z.string().min(1, { message: "Family name is required" }),
})

const JoinSchema = z.object({
    familyName: z.string().min(1, { message: "Family name is required" }),
    recipientEmail: z.string().email({ message: "Invalid email address" }),
})

export type AuthenticationState = {
    errors?: {
        email?: string[];
        password?: string[];
    }
    message?: string | null;
};

export type RegistrationState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    }
    message?: string | null; 
};

export type RecipeState = {
    errors?: {
        name?: string[];
        servings?: string[];
        description?: string[];
        instructions?: string[];
        mealType?: string[];
        image?: string[];
        privacyStatus?: string[];
        ingredients?: string[];
        quantity?: string[];
        unit?: string[];
        preparationMethod?: string[];
        tagName?: string[];
    },
    message?: string | null;
};

export type FamilyNameState = {
    errors?: {
        familyName?: string[];
        userId?: string[];
    }
    message?: string | null;
}

export type JoinState = {
    errors?: {
        familyName?: string[];
        recipientEmail?: string[];
    }
    message?: string | null;
}

export async function validateRecipeForm(prevState: RecipeState, formData: FormData): Promise<RecipeState> {
    const validatedFields = RecipeSchema.safeParse({
        name: formData.get("name"),
        servings: parseInt(formData.get("servings") as string),
        description: formData.get("description"),
        instructions: formData.getAll("instructions").map(instruction => instruction.toString()),
        mealType: formData.get("mealType"),
        image: formData.get("image"),
        privacyStatus: formData.get("privacyStatus"),
        ingredients: Array.from(formData.getAll("ingredients")).map(ingredient => {
            const parsedIngredient = JSON.parse(ingredient as string);
            return { 
                name: parsedIngredient.ingredientName, 
                quantity: parseFloat(parsedIngredient.quantity), 
                unit: parsedIngredient.unit, 
                preparationMethod: parsedIngredient.preparationMethod || '' 
            };
        }),
        tags: formData.getAll("tags").map(tag => tag.toString()),
    });

    if (!validatedFields.success) {
        return { ...prevState, errors: validatedFields.error.flatten().fieldErrors };
    }

    return { ...prevState, errors: {} };
}

export async function registerUser(prevState: RegistrationState, formData: FormData): Promise<RegistrationState> {
    const validatedFields = RegistrationSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
        return { ...prevState, errors: validatedFields.error.flatten().fieldErrors };
    }

    const { name, email, password } = validatedFields.data;

    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (user.rowCount && user.rowCount > 0) {
        return { message: "User already exists" };
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    try {
        await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${passwordHashed})`;
    }
    catch (error) {
        console.error(error);
        return { message: "Database Error. Failed to create user." };
    }
    redirect("/signin");
};

export async function authorizeUser(prevState: AuthenticationState, formData: FormData): Promise<AuthenticationState> {
    const validatedFields = AuthenticationSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {...prevState, errors: validatedFields.error.flatten().fieldErrors };
    }

    const { email, password } = validatedFields.data;

    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (!user.rowCount || user.rowCount === 0) {
        return { errors: { email: ["User not found"] } };
    }    

    const userRecord = user.rows[0];
    const passwordMatch = await bcrypt.compare(password, userRecord.password);
    if (!passwordMatch) {
        return { errors: { password: ["Invalid password"] } };
    } 
    return {message: "Success"};
}

export async function getUser(email: string): Promise<User | null> {
    try {
        const response = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (response.rowCount === 0) {
            return null;
        }
        const user = response.rows[0] as User;
        return { ...user };
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
    }
}


export async function addRecipe(name: string, servings: number, description: string, instructions: string, 
    mealType: MealType, image: string, created: string, userId: number, privacyStatus: PrivacyStatus): Promise<Recipe["recipe_id"]> {
    try {
        const recipeId = await sql`INSERT INTO recipe (recipe_name, recipe_servings, recipe_description, recipe_instructions, meal_type, recipe_image, created_on, user_id, privacy_status)
        VALUES (${name}, ${servings}, ${description}, ${instructions}, ${mealType}, ${image}, ${created}, ${userId}, ${privacyStatus}) RETURNING recipe_id`;
        return recipeId.rows[0].recipe_id;
    } catch (error) {
        console.error("Error adding recipe:", error);
        throw new Error("Failed to add recipe");
    }
}
function toTitleCase(text: string | null | undefined): string {
  if (!text) {
    return "";
  }
  return text
    .replace(/\b[a-zA-Z]\S*/g, (match) =>
      match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
    )
    .replace(/-[a-zA-Z]/g, (match) =>
      "-" + match.charAt(1).toUpperCase()
    );
}

export async function addIngredient(recipeId: number, ingredientName: string, quantity: number, unit: string, preparationMethod: string): Promise<void> {
  try {
    ingredientName = toTitleCase(ingredientName);

    // Insert if not present; do nothing on conflict
    await sql`
      INSERT INTO ingredients (ingredient_name) 
      VALUES (${ingredientName})
      ON CONFLICT (ingredient_name) DO NOTHING
    `;

    // Fetch the ingredient ID always
    const ingredientId = await sql`
      SELECT ingredient_id FROM ingredients WHERE ingredient_name = ${ingredientName}
    `;

    const ingredientIdValue = ingredientId.rows[0].ingredient_id;

    await sql`
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation_method) 
      VALUES (${recipeId}, ${ingredientIdValue}, ${quantity}, ${unit}, ${preparationMethod})
    `;
  } catch (error) {
    console.error("Error adding ingredient:", error);
    throw new Error("Failed to add ingredient");
  }
}

export async function addTag(recipeId: number, tagName: string): Promise<void> {
  try {
    tagName = toTitleCase(tagName);

    // Insert if not present; do nothing on conflict
    await sql`
      INSERT INTO tags (tag_name) 
      VALUES (${tagName})
      ON CONFLICT (tag_name) DO NOTHING
    `;

    // Fetch the tag ID always
    const tagId = await sql`
      SELECT tag_id FROM tags WHERE tag_name = ${tagName}
    `;

    const tagIdValue = tagId.rows[0].tag_id;

    await sql`
      INSERT INTO recipe_tags (recipe_id, tag_id) 
      VALUES (${recipeId}, ${tagIdValue})
    `;
  } catch (error) {
    console.error("Error adding tag:", error);
    throw new Error("Failed to add tag");
  }
}

export async function addMealPlan( date: string, user_id: number ): Promise<void> {
  try {
     await sql`
      INSERT INTO meal_plan (date, user_id)
      VALUES (${date}, ${user_id})
      RETURNING plan_id
    `;
  } catch (error) {
    console.log("Error adding meal plan:", error);
    throw new Error("Failed to add meal plan");
  }
}

export async function addPlanRecipe(plan_id: number, recipe_id: number, total_servings: number, meal_type: MealType, day: string ): Promise<void> {
  try {
    await sql`
      INSERT INTO meal_plan_recipe (plan_id, recipe_id, total_servings, meal_type, day)
      VALUES (${plan_id}, ${recipe_id}, ${total_servings} , ${meal_type}, ${day}) 
      RETURNING plan_item_id  
    `;
  } catch (error) {
    console.log("Error adding recipe to meal plan:", error);
    throw new Error("Failed to add recipe to meal plan");
  }
}

export async function getRecipes(): Promise<Recipe[]> {
    try {
        const result = await sql`SELECT * FROM recipe WHERE privacy_status = 'Community' ORDER BY created_on DESC`;
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

export async function deleteRecipe(recipeId: number): Promise<void> {
    try {
        await sql`DELETE FROM recipe WHERE recipe_id = ${recipeId}`;
    } catch (error) {
        console.error("Error deleting recipe:", error);
        throw new Error("Failed to delete recipe");
    }
}

export async function updateRecipe(recipeId: number, name: string, servings: number, description: string, instructions: string, 
    mealType: MealType, image: string, privacyStatus: PrivacyStatus): Promise<void> {
    try {
        await sql`UPDATE recipe SET recipe_name = ${name}, recipe_servings = ${servings}, recipe_description = ${description}, 
        recipe_instructions = ${instructions}, meal_type = ${mealType}, recipe_image = ${image}, privacy_status = ${privacyStatus} WHERE recipe_id = ${recipeId}`;
    } catch (error) {
        console.error("Error updating recipe:", error);
        throw new Error("Failed to update recipe");
    }
}

export async function updateRecipeIngredients(recipeId: number, updatedIngredients: { ingredientName: string, quantity: number, unit: string, preparationMethod: string }[]): Promise<void> {
  try {
    // Fetch existing ingredients for the recipe
    const existingIngredients = await sql`
      SELECT i.ingredient_name FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      WHERE ri.recipe_id = ${recipeId}
    `;

    const existingIngredientNames = existingIngredients.rows.map(row => row.ingredient_name);

    // Determine ingredients to remove
    const updatedIngredientNames = updatedIngredients.map(ingredient => toTitleCase(ingredient.ingredientName));
    const ingredientsToRemove = existingIngredientNames.filter(name => !updatedIngredientNames.includes(name));

    // Remove ingredients that are no longer present
    if (ingredientsToRemove.length > 0) {
      const pgIngredientsToRemove = toPostgresArray(ingredientsToRemove);

      await sql`
        DELETE FROM recipe_ingredients
        WHERE recipe_id = ${recipeId} AND ingredient_id IN (
          SELECT ingredient_id FROM ingredients WHERE ingredient_name = ANY(${pgIngredientsToRemove}::text[])
        )
      `;
    }

    // Insert or update the remaining ingredients
    for (const ingredient of updatedIngredients) {
      const ingredientName = toTitleCase(ingredient.ingredientName);

      // Insert the ingredient into the ingredients table if it doesn't already exist
      await sql`
        INSERT INTO ingredients (ingredient_name) 
        VALUES (${ingredientName})
        ON CONFLICT (ingredient_name) DO NOTHING
      `;

      // Fetch the ingredient ID from the ingredients table
      const ingredientId = await sql`
        SELECT ingredient_id FROM ingredients WHERE ingredient_name = ${ingredientName}
      `;

      const ingredientIdValue = ingredientId.rows[0].ingredient_id;

      // Insert or update the recipe_ingredients table with the new quantity, unit, and preparation method
      await sql`
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation_method)
        VALUES (${recipeId}, ${ingredientIdValue}, ${ingredient.quantity}, ${ingredient.unit}, ${ingredient.preparationMethod})
        ON CONFLICT (recipe_id, ingredient_id) 
        DO UPDATE SET quantity = ${ingredient.quantity}, unit = ${ingredient.unit}, preparation_method = ${ingredient.preparationMethod}
      `;
    }
  } catch (error) {
    console.error("Error updating ingredients:", error);
    throw new Error("Failed to update ingredients");
  }
}

export async function updateRecipeTags(recipeId: number, updatedTags: { tagName: string }[]): Promise<void> {
  try {
    // Fetch existing tags for the recipe
    const existingTags = await sql`
      SELECT t.tag_name FROM recipe_tags rt
      JOIN tags t ON rt.tag_id = t.tag_id
      WHERE rt.recipe_id = ${recipeId}
    `;

    const existingTagNames = existingTags.rows.map(row => row.tag_name);

    // Determine tags to remove
    const updatedTagNames = updatedTags.map(tag => toTitleCase(tag.tagName));
    const tagsToRemove = existingTagNames.filter(name => !updatedTagNames.includes(name));

    // Remove tags that are no longer present
    if (tagsToRemove.length > 0) {
      const pgTagsToRemove = toPostgresArray(tagsToRemove);
      await sql`
        DELETE FROM recipe_tags
        WHERE recipe_id = ${recipeId} AND tag_id IN (
          SELECT tag_id FROM tags WHERE tag_name = ANY(${pgTagsToRemove}::text[])
        )
      `;
    }

    // Insert or update the remaining tags
    for (const tag of updatedTags) {
      const tagName = toTitleCase(tag.tagName);

      // Insert the tag into the tags table if it doesn't already exist
      await sql`
        INSERT INTO tags (tag_name) 
        VALUES (${tagName})
        ON CONFLICT (tag_name) DO NOTHING
      `;

      // Fetch the tag ID from the tags table
      const tagId = await sql`
        SELECT tag_id FROM tags WHERE tag_name = ${tagName}
      `;

      const tagIdValue = tagId.rows[0].tag_id;

      // Insert or update the recipe_tags table with the new tag ID
      await sql`
        INSERT INTO recipe_tags (recipe_id, tag_id)
        VALUES (${recipeId}, ${tagIdValue})
        ON CONFLICT (recipe_id, tag_id) 
        DO NOTHING
      `;
    }
  } catch (error) {
    console.error("Error updating tags:", error);
    throw new Error("Failed to update tags");
  }
}

function toPostgresArray(arr: string[]): string {
  return `{${arr
    .map((s) => `"${s.replace(/"/g, '\\"')}"`)
    .join(",")}}`;
}

export async function validateFamilyGroup(prevState: FamilyNameState, formData: FormData): Promise<FamilyNameState> {
    const validatedFields = FamilyNameSchema.safeParse({
        familyName: formData.get("familyName"),
    });

    if (!validatedFields.success) {
        return { ...prevState, errors: validatedFields.error.flatten().fieldErrors };
    }
    return { ...prevState, errors: {} };
}

export async function addNewFamilyGroup(familyName: string, userId: number): Promise<{ familyId: number, familyName: string } | { message: string }> {
    try {
        const familyId = await sql`INSERT INTO family (family_name) VALUES (${familyName}) RETURNING family_id`;
        const familyIdValue = familyId.rows[0].family_id;
        await sql`INSERT INTO user_family_group (id, family_id) VALUES (${userId}, ${familyIdValue})`;
        return { familyId: familyIdValue, familyName: familyName };
    } catch (error) {
        console.error("Error adding family group:", error);
        return { message: "Failed to create family group" };
    }
  
}

export async function editFamilyGroup(familyId: number, familyName: string): Promise<{ familyId: number, familyName: string } | { message: string }> {
    try {
        await sql`UPDATE family SET family_name = ${familyName} WHERE family_id = ${familyId}`;
        return { familyId, familyName };
    } catch (error) {
        console.error("Error editing family group:", error);
        return { message: "Failed to edit family group" };
    }
}

export async function leaveFamilyGroup(userId: number, familyId: number): Promise<void> {
    try {
        await sql`DELETE FROM user_family_group WHERE id = ${userId} AND family_id = ${familyId}`;
        const remainingMembers = await sql`SELECT * FROM user_family_group WHERE family_id = ${familyId}`;
        if (remainingMembers.rowCount === 0) {
            await sql`DELETE FROM family WHERE family_id = ${familyId}`;
        }
    } catch (error) {
        console.error("Error leaving family group:", error);
        throw new Error("Failed to leave family group");
    }
}

export async function validateJoinFamilyGroup(prevState: JoinState, formData: FormData): Promise<JoinState> {
    const validatedFields = JoinSchema.safeParse({
        familyName: formData.get("familyName"),
        recipientEmail: formData.get("recipientEmail"),
    });

    if (!validatedFields.success) {
        return { ...prevState, errors: validatedFields.error.flatten().fieldErrors };
    }
    return { ...prevState, errors: {} };
}

export async function joinFamilyGroup(familyName: string, recipientEmail: string, userId: number): Promise<{ message: string }> {
    try {
      const recipientUserId = await sql`SELECT id FROM users WHERE email = ${recipientEmail}`;
      if (recipientUserId.rowCount === 0) {
        return { message: "Recipient not found" };
      }
      const recipientId = recipientUserId.rows[0].id;
      
      const familyId = await sql`SELECT family_id FROM family WHERE family_name = ${familyName}`;
      if (familyId.rowCount === 0) {
        return { message: "Family not found" };
      }
      const familyIdValue = familyId.rows[0].family_id;

      const openRequest = await sql`
        SELECT * FROM family_requests 
        WHERE user_id = ${userId} AND recipient_user_id = ${recipientId} AND family_id = ${familyIdValue} AND status = 'pending'
      `;
      if (openRequest.rowCount && openRequest.rowCount > 0) {
        return { message: "There is already an open request for this user and recipient in the specified family" };
      }

      const existingFamilyGroup = await sql`
        SELECT * FROM user_family_group 
        WHERE id = ${userId} AND family_id = ${familyIdValue} AND family_id IN (
          SELECT family_id FROM user_family_group WHERE id = ${recipientId}
        )
      `;
      if (existingFamilyGroup.rowCount && existingFamilyGroup.rowCount > 0) {
        return { message: "User is already in a family group with the recipient" };
      }

      await sql`INSERT INTO family_requests (user_id, recipient_user_id, family_id) VALUES (${userId}, ${recipientId}, ${familyIdValue})`;
      return { message: "Success" };

    } catch (error) {
      console.error("Error soliciting join family group:", error);
      return { message: "Failed to solicit join family group" };
    }
}

export async function approveFamilyGroup(requestId: number): Promise<{ message: string }> {
    try {
      const familyRequest = await sql`
        SELECT * FROM family_requests 
        WHERE request_id = ${requestId}
      `;
      if (familyRequest.rowCount === 0) {
        return { message: "Request not found" };
      }
      const userId = familyRequest.rows[0].user_id;
      const familyId = familyRequest.rows[0].family_id;

      await sql`
        INSERT INTO user_family_group (id, family_id) VALUES (${userId}, ${familyId})
      `;
      await sql`
        UPDATE family_requests SET status = 'approved' WHERE request_id = ${requestId}
      `;
      return { message: "Success" };
    }
    catch (error) {
      console.error("Error approving family group request:", error);
      return { message: "Failed to approve family group request" };
    }
}

export async function denyFamilyGroup(requestId: number): Promise<{ message: string }> {
    try {
      const familyRequest = await sql`
        SELECT * FROM family_requests 
        WHERE request_id = ${requestId}
      `;
      if (familyRequest.rowCount === 0) {
        return { message: "No pending request found" };
      }

      await sql`
        DELETE FROM family_requests WHERE request_id = ${requestId}
      `;
      return { message: "Success" };
    }
    catch (error) {
      console.error("Error rejecting family group request:", error);
      return { message: "Failed to reject family group request" };
    }
}
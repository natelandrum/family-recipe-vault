import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';
dotenv.config();

import {
  users,
  families,
  family_users,
  recipes,
  tags,
  recipeTags,
  ingredients,
  recipeIngredients,
  historicalNotes,
  mealPlans,
  mealPlanRecipes,
  shoppingLists,
  shoppingListItems,
} from './seedData.js';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

   // Seed `users`
const insertedUsers = await Promise.all(
  users.map(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return pool.query(
      `INSERT INTO public.users (name, email, password) VALUES ($1, $2, $3)`,
      [user.name, user.email, hashedPassword]
    );
  })
);

    // Seed `families`
    for (const family of families) {
      await pool.query(`INSERT INTO family (family_name) VALUES ($1)`, [family.family_name]);
    }

    // Seed `family_users`
    for (const familyUser of family_users) {
      await pool.query(
        `INSERT INTO family_users (user_id, family_id) VALUES ($1, $2)`,
        [familyUser.user_id, familyUser.family_id]
      );
    }

    // Seed `recipes`
    for (const recipe of recipes) {
      await pool.query(
        `INSERT INTO public.recipe (recipe_name, recipe_servings, recipe_description, recipe_instructions, meal_type, recipe_image, created_on, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          recipe.recipe_name,
          recipe.recipe_servings,
          recipe.recipe_description,
          recipe.recipe_instructions,
          recipe.meal_type,
          recipe.recipe_image,
          recipe.created_on,
          recipe.user_id,
        ]
      );
    }

    // Seed `tags`
    for (const tag of tags) {
      await pool.query(`INSERT INTO public.tag (tag_name) VALUES ($1)`, [tag.tag_name]);
    }

    // Seed `recipe_tags`
    for (const recipeTag of recipeTags) {
      await pool.query(
        `INSERT INTO public.recipe_tag (recipe_id, tag_id) VALUES ($1, $2)`,
        [recipeTag.recipe_id, recipeTag.tag_id]
      );
    }

    // Seed `ingredients`
    for (const ingredient of ingredients) {
      await pool.query(
        `INSERT INTO public.ingredient (ingredient_name) VALUES ($1)`,
        [ingredient.ingredient_name]
      );
    }

    // Seed `recipe_ingredients`
    for (const recipeIngredient of recipeIngredients) {
      await pool.query(
        `INSERT INTO public.recipe_ingredient (recipe_id, ingredient_id, quantity, unit, preparation_method) VALUES ($1, $2, $3, $4, $5)`,
        [
          recipeIngredient.recipe_id,
          recipeIngredient.ingredient_id,
          recipeIngredient.quantity,
          recipeIngredient.unit,
          recipeIngredient.preparation_method,
        ]
      );
    }

    // Seed `historical_notes`
    for (const historicalNote of historicalNotes) {
      await pool.query(
        `INSERT INTO public.historical_note (note, user_id, recipe_id) VALUES ($1, $2, $3)`,
        [historicalNote.note, historicalNote.user_id, historicalNote.recipe_id]
      );
    }

    // Seed `meal_plans`
    for (const mealPlan of mealPlans) {
      await pool.query(
        `INSERT INTO public.meal_plan (date, user_id) VALUES ($1, $2)`,
        [mealPlan.date, mealPlan.user_id]
      );
    }

    // Seed `meal_plan_recipes`
    for (const mealPlanRecipe of mealPlanRecipes) {
      await pool.query(
        `INSERT INTO public.meal_plan_recipe (plan_id, recipe_id, total_servings, meal_type) VALUES ($1, $2, $3, $4)`,
        [
          mealPlanRecipe.plan_id,
          mealPlanRecipe.recipe_id,
          mealPlanRecipe.total_servings,
          mealPlanRecipe.meal_type,
        ]
      );
    }

    // Seed `shopping_lists`
    for (const shoppingList of shoppingLists) {
      await pool.query(
        `INSERT INTO public.shopping_list (plan_id) VALUES ($1)`,
        [shoppingList.plan_id]
      );
    }

    // Seed `shopping_list_items`
    for (const shoppingListItem of shoppingListItems) {
      await pool.query(
        `INSERT INTO public.shopping_list_item (list_id, ingredient_id, quantity, unit) VALUES ($1, $2, $3, $4)`,
        [
          shoppingListItem.list_id,
          shoppingListItem.ingredient_id,
          shoppingListItem.quantity,
          shoppingListItem.unit,
        ]
      );
    }

    console.log('✅ Database seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    await pool.end();
  }
};

seedDatabase();

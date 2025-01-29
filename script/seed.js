import {
  users,
  families,
  familyUsers,
  recipes,
  tag,
  recipeTags,
  ingredient,
  recipeIngredients,
  historicalNotes,
  mealPlans,
  mealPlanRecipes,
  shoppingLists,
  shoppingListItems,
} from './seedData.js';
import bcrypt from 'bcrypt';
import dbConnect from '../app/lib/dbConnect.ts'

const pool = dbConnect()

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

    // Seed `familyUsers`
    for (const user_family_group of familyUsers) {
      await pool.query(
        `INSERT INTO user_family_group (id, family_id) VALUES ($1, $2)`,
        [user_family_group.id, user_family_group.family_id]
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
    for (const tags of tag) {
      await pool.query(`INSERT INTO public.tags (tag_name) VALUES ($1)`, [tags.tag_name]);
    }

    // Seed `recipe_tags`
    for (const recipe_tags of recipeTags) {
      await pool.query(
        `INSERT INTO public.recipe_tags (recipe_id, tag_id) VALUES ($1, $2)`,
        [recipe_tags.recipe_id, recipe_tags.tag_id]
      );
    }

    // Seed `ingredients`
    for (const ingredients of ingredient) {
      await pool.query(
        `INSERT INTO public.ingredients (ingredient_name) VALUES ($1)`,
        [ingredients.ingredient_name]
      );
    }

    // Seed `recipe_ingredients`
    for (const recipe_ingredients of recipeIngredients) {
      await pool.query(
        `INSERT INTO public.recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation_method) VALUES ($1, $2, $3, $4, $5)`,
        [
          recipe_ingredients.recipe_id,
          recipe_ingredients.ingredient_id,
          recipe_ingredients.quantity,
          recipe_ingredients.unit,
          recipe_ingredients.preparation_method,
        ]
      );
    }

    // Seed `historical_notes`
    for (const historical_note of historicalNotes) {
      await pool.query(
        `INSERT INTO public.historical_note (note, user_id, recipe_id) VALUES ($1, $2, $3)`,
        [historical_note.note, historical_note.user_id, historical_note.recipe_id]
      );
    }

    // Seed `meal_plans`
    for (const meal_plan of mealPlans) {
      await pool.query(
        `INSERT INTO public.meal_plan (date, user_id) VALUES ($1, $2)`,
        [meal_plan.date, meal_plan.user_id]
      );
    }

    // Seed `meal_plan_recipes`
    for (const meal_plan_recipe of mealPlanRecipes) {
      await pool.query(
        `INSERT INTO public.meal_plan_recipe (plan_id, recipe_id, total_servings, meal_type) VALUES ($1, $2, $3, $4)`,
        [
          meal_plan_recipe.plan_id,
          meal_plan_recipe.recipe_id,
          meal_plan_recipe.total_servings,
          meal_plan_recipe.meal_type,
        ]
      );
    }

    // Seed `shopping_lists`
    for (const shopping_list of shoppingLists) {
      await pool.query(
        `INSERT INTO public.shopping_list (plan_id) VALUES ($1)`,
        [shopping_list.plan_id]
      );
    }

    // Seed `shopping_list_items`
    for (const shopping_list_item of shoppingListItems) {
      await pool.query(
        `INSERT INTO public.shopping_list_item (list_id, ingredient_id, quantity, units) VALUES ($1, $2, $3, $4)`,
        [
          shopping_list_item.list_id,
          shopping_list_item.ingredient_id,
          shopping_list_item.quantity,
          shopping_list_item.units,
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

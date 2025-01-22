import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your .env file
  ssl: {
    rejectUnauthorized: false, // Necessary for remote databases like Neon or Supabase
  },
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Seed `users`
    await pool.query(`
      INSERT INTO users (name, email, password)
      VALUES
        ('Alice Smith', 'alice@example.com', 'password123'),
        ('Bob Johnson', 'bob@example.com', 'securepassword'),
        ('Charlie Brown', 'charlie@example.com', 'qwerty123');
    `);

    // Seed `family`
    await pool.query(`
      INSERT INTO family (family_name)
      VALUES
        ('Smith Family'),
        ('Johnson Family');
    `);

    // Seed `user_family_group`
    await pool.query(`
      INSERT INTO user_family_group (id, family_id)
      VALUES
        (1, 1), -- Alice belongs to Smith Family
        (2, 2), -- Bob belongs to Johnson Family
        (3, 1); -- Charlie also belongs to Smith Family
    `);

    // Seed `recipe`
    await pool.query(`
      INSERT INTO recipe (recipe_name, recipe_servings, recipe_description, recipe_instructions, meal_type, user_id)
      VALUES
        ('Pancakes', 4, 'Delicious fluffy pancakes', '{"Mix ingredients", "Cook on skillet"}', 'Breakfast', 1),
        ('Spaghetti', 6, 'Classic spaghetti with marinara sauce', '{"Boil pasta", "Prepare sauce"}', 'Dinner', 2);
    `);

    // Seed `tags`
    await pool.query(`
      INSERT INTO tags (tag_name)
      VALUES
        ('Vegetarian'),
        ('Quick Meal'),
        ('Family Favorite');
    `);

    // Seed `recipe_tags`
    await pool.query(`
      INSERT INTO recipe_tags (recipe_id, tag_id)
      VALUES
        (1, 1), -- Pancakes are vegetarian
        (2, 2), -- Spaghetti is a quick meal
        (2, 3); -- Spaghetti is also a family favorite
    `);

    // Seed `ingredients`
    await pool.query(`
      INSERT INTO ingredients (ingredient_name)
      VALUES
        ('Flour'),
        ('Eggs'),
        ('Sugar'),
        ('Spaghetti Pasta'),
        ('Tomato Sauce');
    `);

    // Seed `recipe_ingredients`
    await pool.query(`
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
      VALUES
        (1, 1, 2, 'cups'), -- Pancakes need 2 cups of flour
        (1, 2, 2, 'pcs'), -- Pancakes need 2 eggs
        (2, 4, 500, 'grams'), -- Spaghetti needs 500g of pasta
        (2, 5, 1, 'can'); -- Spaghetti needs 1 can of tomato sauce
    `);

    console.log('✅ Database seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    await pool.end();
  }
};

// Execute seed function
seedDatabase();

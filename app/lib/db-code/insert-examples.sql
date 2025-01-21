-- Insert example for users table:
INSERT INTO public.users (name, email, password, emailUnique)
VALUES
    ('John Doe', 'john.doe@example.com', 'password123', TRUE),
    ('Jane Smith', 'jane.smith@example.com', 'securepass456', FALSE),
    ('Alice Johnson', 'alice.johnson@example.com', 'mysecretpass', TRUE);

-- Insert example for family table:
INSERT INTO family (family_name) VALUES ('Smith Family'), ('Johnson Family');

-- Insert example for user_family_group table:
INSERT INTO family_users (user_id, family_id) VALUES
(1, 1),  -- John Doe belongs to Smith Family
(2, 1),  -- Jane Doe also belongs to Smith Family
(2, 2);  -- Jane Doe also belongs to Johnson Family

-- Insert example for recipe table:
INSERT INTO public.recipe (
    recipe_name, recipe_servings, recipe_description, recipe_instructions, meal_type, recipe_image, created_on, user_id
) VALUES (
    'Spaghetti Bolognese', 
    4, 
    'A classic Italian pasta dish.', 
    ARRAY['Step 1: Cook pasta', 'Step 2: Prepare sauce', 'Step 3: Combine and serve'], 
    'Dinner', 
    'spaghetti.jpg', 
    CURRENT_TIMESTAMP, 
    1
);

-- Insert example for tags table:
INSERT INTO tags (tag_name)
VALUES ('Vegan'), ('Gluten-Free'), ('Low Carb');

-- Insert example for recipe_tags table:
INSERT INTO recipe_tags (recipe_id, tag_id)
VALUES 
    (1, 1), -- Recipe 1 is tagged as "Vegan"
    (1, 2), -- Recipe 1 is tagged as "Gluten-Free"
    (2, 3); -- Recipe 2 is tagged as "Low Carb"

-- Insert example for ingredients table: 
INSERT INTO ingredients (ingredient_name)
VALUES ('Tomato'), ('Garlic'), ('Olive Oil');

-- Insert example for recipe_ingredients table:
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation_method)
VALUES 
    (1, 1, 2, 'Tomatoes', 'chopped'), 
    (1, 2, 3, 'cloves', 'minced'),
    (1, 3, 1, 'tablespoon', 'cold-pressed');

-- Insert into historical_not table:
INSERT INTO historical_note (note, user_id, recipe_id)
VALUES 
    ('This recipe was updated to be vegan in 2024.', 1, 1),
    ('Originally, this recipe used dairy, but now it is dairy-free.', 1, 1);


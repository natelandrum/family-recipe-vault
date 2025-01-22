CREATE TYPE public.meal_type AS ENUM
	('Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert');

ALTER TYPE public.meal_type OWNER TO neondb_owner;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    CONSTRAINT id_pkey PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (email)
);

CREATE TABLE family (
    family_id SERIAL PRIMARY KEY,
    family_name VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS familyUser (
    id INT NOT NULL,
    family_id INT NOT NULL,
    PRIMARY KEY (id, family_id),
    FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (family_id) REFERENCES family (family_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.recipe
(
    recipe_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    recipe_name VARCHAR(255) NOT NULL,
    recipe_servings INT NOT NULL,
    recipe_description VARCHAR(255) NOT NULL,
    recipe_instructions TEXT[] NOT NULL,
    meal_type meal_type NOT NULL DEFAULT 'Dinner',
    recipe_image character varying,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    CONSTRAINT recipe_id_pkey PRIMARY KEY (recipe_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (recipe_id, tag_id),
    CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id) ON DELETE CASCADE,
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags (tag_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(50) NOT NULL,
    preparation_method VARCHAR(255),
    PRIMARY KEY (recipe_id, ingredient_id),
    CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id) ON DELETE CASCADE,
    CONSTRAINT fk_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients (ingredient_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS historical_note (
    note_id SERIAL PRIMARY KEY,
    note VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_plan (
    plan_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_plan_recipe (
    mp_recipe_id SERIAL PRIMARY KEY,
    plan_id INT NOT NULL,
    recipe_id INT NOT NULL,
    total_servings INT NOT NULL,
    meal_type meal_type NOT NULL,
    CONSTRAINT fk_plan FOREIGN KEY (plan_id) REFERENCES meal_plan (plan_id) ON DELETE CASCADE,
    CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipe (recipe_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shopping_list (
    list_id SERIAL PRIMARY KEY,
    plan_id INT NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_plan FOREIGN KEY (plan_id) REFERENCES meal_plan (plan_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shopping_list_item (
    item_id SERIAL PRIMARY KEY,
    list_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity INT NOT NULL,
    units VARCHAR(20),
    is_checked BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_list FOREIGN KEY (list_id) REFERENCES shopping_list (list_id) ON DELETE CASCADE,
    CONSTRAINT fk_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients (ingredient_id) ON DELETE CASCADE
);

export interface User {
    id: number;
    name: string;
    email: string; //constrained as Unique
    password: string;
};

export interface Family {
    family_id: string;
    family_name: string;
}

export interface UserFamily {
    id: number;
    family_id: number;
}

export enum MealType {
    Breakfast = 'Breakfast',
    Lunch = 'Lunch',
    Dinner = 'Dinner',
    Snack = 'Snack',
    Dessert = 'Dessert'
}

export interface Recipe {
    recipe_id: number;
    recipe_name: string;
    recipe_servings: number;
    recipe_description: string;
    recipe_instructions: string[];
    meal_type: MealType;
    recipe_image?: string;
    created_on: string;
    user_id: number;
    privacy_status: PrivacyStatus;
}

export interface RecipeWithAuthor extends Recipe {
    author_name: string;

}

export interface Tag {
    tag_id: number;
    tag_name: string;
}

export interface RecipeTag {
    recipe_id: number;
    tag_id: number;
}

export interface Ingredient {
    ingredient_id: number;
    ingredient_name: string; //constrained as Unique
}

export interface RecipeIngredient {
    recipe_id: number;
    ingredient_id: number;
    quantity: number;
    unit: string;
    preparation_method?: string;
}

export interface HistoricalNote {
    note_id: number;
    note: string;
    user_id: number;
    recipe_id: number;
    created_on: Date;
}

export interface MealPlan {
    plan_id: number;
    date: Date;
    user_id: number;
}

export interface MealPlanRecipe {
    plan_item_id: number;
    plan_id: number;
    recipe_id: number;
    total_servings: number;
    meal_type: MealType;
    day: Date;
}

export interface MealPlanRecipeData extends MealPlanRecipe {
    recipe_name: string;
    recipe_servings: number
    date: Date;
}

export interface ShoppingList {
    list_id: number;
    plan_id: number;
    created_on: Date;
}

export interface ShoppingListItem {
    item_id: number;
    list_id: number;
    ingredient_id: number;
    quantity: number;
    units: string;
    is_checked: boolean;
}

export enum PrivacyStatus {
    Community = 'Community',
    Private = 'Private',
    Family = 'Family'

}
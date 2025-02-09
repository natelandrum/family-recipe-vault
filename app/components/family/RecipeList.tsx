interface RecipeListProps {
    recipes: {
        recipe_id: number;
        recipe_name: string;
        recipe_description: string;
    }[];
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
                <li key={recipe.recipe_id} className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">{recipe.recipe_name}</h3>
                    <p className="text-sm text-gray-600">{recipe.recipe_description}</p>
                </li>
            ))}
        </ul>
    );
};

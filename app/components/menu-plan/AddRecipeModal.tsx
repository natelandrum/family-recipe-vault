import { useState } from "react";
import { MealType, MealPlanRecipe, MealPlan } from "@/app/lib/definitions";
import { useUser } from "@/app/lib/hooks/useUser";

interface AddRecipeModalProps {
  show: boolean;
  onClose: () => void;
  recipeId: number;
  recipeName: string;
  userMealPlans: MealPlan[];
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ show, onClose, recipeId, recipeName, userMealPlans }) => {
  const [mealType, setMealType] = useState<MealType>(MealType.Breakfast);
  const [totalServings, setTotalServings] = useState<number>(4);
  const [selectedPlanId, setSelectedPlanId] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const { user } = useUser();

  console.log("Prop data sent for userPlans", userMealPlans.flat());
  console.log("Data stored selected PlanId", selectedPlanId);
  console.log("Day selected on modal:", selectedDay);
  if (!show) return null; 
 
  const handleAddRecipe = async () => {
    if (!user) return;
    try {
      let finalPlanId = selectedPlanId;

      if (finalPlanId === 0) {
        const newPlan = await fetch("/api/add-meal-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: selectedDay, user_id: user.id }),
        });
         
        finalPlanId = await newPlan.json();
        setSelectedPlanId(finalPlanId);
      }

      if (selectedPlanId !==0 ) {
        console.log("This is new selectedPlanId", selectedPlanId)
        const newMeal: MealPlanRecipe = {
          plan_item_id: Math.random(), 
          plan_id: selectedPlanId, 
          recipe_id: recipeId,
          total_servings: totalServings,
          meal_type: mealType,
          day: new Date(selectedDay),
        };

        console.log("Added to Meal Plan:", newMeal); 
        
        console.log("Date sent to new plan", selectedDay)

        const response = await fetch("/api/add-plan-recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan_id: selectedPlanId, recipe_id: recipeId, total_servings: totalServings, meal_type: mealType, day: selectedDay }),
        });

        if (!response.ok) throw new Error("Failed to create a new meal plan");

        onClose();
      }
    } catch (error) {
      console.error('Error adding recipe to meal plan:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add {recipeName} to Meal Plan</h2>

        {/* Meal Type Selection */}
        <div className="mb-4">
          <label htmlFor="mealType" className="block text-sm font-semibold">Meal Type</label>
          <select
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="border rounded-md p-2 w-full"
          >
            {Object.values(MealType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Servings Input */}
        <div className="mb-4">
          <label htmlFor="totalServings" className="block text-sm font-semibold">Total Servings</label>
          <input
            type="number"
            id="totalServings"
            value={totalServings}
            onChange={(e) => setTotalServings(Number(e.target.value))}
            className="border rounded-md p-2 w-full"
          />
        </div>
        
        {/* Plan Selection */}
        <div className="mb-4">
          <label htmlFor="plan" className="block text-sm font-semibold">Select Plan</label>
          <select
            id="plan"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(Number(e.target.value))}
            className="border rounded-md p-2 w-full"
          >
            <option value={0}>Start New Plan</option>
            {userMealPlans.flat().map((day) => (
              <option key={day.plan_id} value={day.plan_id}>
                {new Date(day.date).toISOString().split("T")[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Show Date Picker if "Start New Plan" is Selected */}
        {selectedPlanId === 0 && (
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-semibold">Pick Start Date</label>
            <input
              type="date"
              id="startDate"
              value={selectedDay}
              onChange={(e) => setSelectedDay(new Date(e.target.value).toISOString().split("T")[0])}
              className="border rounded-md p-2 w-full"
            />
          </div>
        )}

        {/* Show Day Selection Only for Existing Plans */}
        {selectedPlanId !== 0 && (
          <div className="mb-4">
            <label htmlFor="day" className="block text-sm font-semibold">Select Day</label>
            <select
              id="day"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="border rounded-md p-2 w-full"
              disabled={!selectedPlanId}
            >
              <option value="" disabled>Select a Day</option>
              {(() => {
                const selectedPlan = userMealPlans.flat().find(plan => plan.plan_id === selectedPlanId);
                if (!selectedPlan) return null; 

                const startDate = new Date(selectedPlan.date);
                return Array.from({ length: 7 }, (_, i) => {
                  const date = new Date(startDate);
                  date.setDate(startDate.getDate() + i);
                  return (
                    <option key={date.toISOString().split("T")[0]} value={date.toISOString().split("T")[0]}>
                      {date.toISOString().split("T")[0]} 
                    </option>
                  );
                });
              })()}
            </select>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddRecipe}
            className="bg-accent text-white px-4 py-2 rounded-md"
          >
            Add Recipe
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 bg-dark text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeModal;

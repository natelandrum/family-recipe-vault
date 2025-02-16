import { useState, useEffect } from "react";
import { MealPlanRecipeData, MealType } from "@/app/lib/definitions";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface MealPlanViewProps {
  selectedMealPlan: MealPlanRecipeData[]; 
}

type MealPlanByDay = {
  [day: string]: {
    [meal in MealType]?: MealPlanRecipeData;
  };
};

export default function MealPlanView({ selectedMealPlan }: MealPlanViewProps) {
  const [mealPlan, setMealPlan] = useState<MealPlanRecipeData[]>(selectedMealPlan);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMealPlan(selectedMealPlan);
  }, [selectedMealPlan]);

  if (!mealPlan) {
    return <h3 className="text-2xl">Please select or create a new meal plan.</h3>;
  };

  if (!mealPlan || mealPlan.length === 0) {
    return <h3 className="text-2xl">Please select or create a new meal plan.</h3>;
  }

  const handleDelete = async (planItemId: number) => {
    if  (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/delete-plan-item/${planItemId}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error(`Failed to delete meal. Status: ${response.status}`);
      }

      setMealPlan((prevPlan) => {
        const updatedPlan = prevPlan.filter((meal) => meal.plan_item_id !== planItemId);
        console.log("Updated Meal Plan:", updatedPlan);
        return updatedPlan;
      });

    } catch (error) {
      console.error("Error deleting meal:", error);
    } finally {
      setLoading(false);
    }

  };
 
  const planDays = Array.from({ length: mealPlan.length }, (_, i) => {
    const day = new Date(mealPlan[0].day);
    day.setDate(day.getDate() + i);
    return day.toISOString().split("T")[0];
  });

  console.log("Plan days:", planDays)


  const uniqueDays = Array.from(
    new Set(mealPlan.map((meal) => new Date(meal.day).toISOString().split("T")[0]))
  ).sort();

  console.log("Unique Days:", uniqueDays)

  const filteredPlans = mealPlan.filter((plan) => 
    planDays.includes(
      plan.day instanceof Date ? plan.date.toISOString().split("T")[0] : plan.day
    )
  );

  const mealPlanByDay: MealPlanByDay = filteredPlans.reduce((acc, plan) => {
    const mealDate = new Date(plan.day).toISOString().split("T")[0]; 

    if (!acc[mealDate]) {
      acc[mealDate] = {
        Breakfast: undefined,
        Lunch: undefined,
        Dinner: undefined,
        Snack: undefined,
        Dessert: undefined,
      };
    }

    acc[mealDate][plan.meal_type as MealType] = plan;
    return acc;
  }, {} as MealPlanByDay);

  console.log("Meal Plans by day:", mealPlanByDay)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {uniqueDays.map((day, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md min-h-[150px]">
          <h2 className="text-2xl font-semibold mb-2">
          <strong>
          {new Date(day + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })}{": "}
          {String(day).slice(5, 7)}-{String(day).slice(8, 10)}
          </strong>
          </h2>          
          {mealPlanByDay[day] ? (
            Object.entries(mealPlanByDay[day]).map(([mealType, meal]) => (
              meal ? (
                <div key={meal.plan_item_id} className="mb-2">
                  <strong>{mealType}:</strong> {meal.recipe_name} {" "}
                  <RemoveCircleOutlineIcon 
                    className="text-highlight cursor-pointer hover:text-dark transition duration-200"
                    fontSize="small"
                    onClick={() => handleDelete(meal.plan_item_id)}
                  /><br></br>
                  (Servings:{" "} {meal.total_servings})
                </div>
              ) : (
                <div key={mealType} className="mb-2">
                  <strong>{mealType}:</strong> <span></span>
                </div>
              )
            ))
          ) : (
            <p>No meals planned</p>
          )}
        </div>
      ))}
    </div>
  );
}
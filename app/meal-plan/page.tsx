"use client";
import { useState, useEffect } from "react";
import MealPlanView from "@/app/components/menu-plan/MealPlanView";
import { MealPlanRecipeData } from "@/app/lib/definitions";
import { useUser } from "@/app/lib/hooks/useUser";
import { getMealPlansByUserId, getMealPlanRecipesByPlanID } from "@/app/lib/data";
import { useCallback } from "react";


export default function MealPlan() {
  const { user } = useUser();
  const [mealPlans, setMealPlans] = useState<MealPlanRecipeData[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlanRecipeData[]>([]);
  const [pastMealPlans, setPastMealPlans] = useState<{ date: string; plan_id: number; }[]>([]);
  
  const fetchMealPlans = useCallback(async () => {
    if (!user) return;

    const fetchedMealPlans = await getMealPlansByUserId(user.id);

    if (fetchedMealPlans.length === 0) return;

    const pastDates = fetchedMealPlans.map(plan => ({
      date: new Date(plan.date).toISOString().split("T")[0],
      plan_id: plan.plan_id,
    }));

    setPastMealPlans(pastDates);

    const mealPlanRecipes = await Promise.all(
      fetchedMealPlans.map(async (plan) => {
        const recipes = await getMealPlanRecipesByPlanID(plan.plan_id);
        return recipes.map((recipe) => ({
          plan_item_id: recipe.plan_item_id,
          plan_id: plan.plan_id,
          date: plan.date,
          recipe_id: recipe.recipe_id,
          total_servings: recipe.total_servings,
          meal_type: recipe.meal_type,
          recipe_name: recipe.recipe_name,
          recipe_servings: recipe.recipe_servings,
          day: recipe.day,
        }));
      })
    );
    const flattenedMealPlans = mealPlanRecipes.flat();
    setMealPlans(flattenedMealPlans as MealPlanRecipeData[]);

    const latestPlan = pastDates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (latestPlan) {
      setSelectedPlanId(latestPlan.plan_id);
      setSelectedMealPlan(flattenedMealPlans.filter(plan => plan.plan_id === latestPlan.plan_id));
    }

  }, [user]);

  useEffect(() => {
    if (user) fetchMealPlans();
  }, [user, fetchMealPlans]);

  const startNewPlan = async () => {
    if (!user) return;
    try {
      const response = await fetch("/api/add-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString(), user_id: user.id }),
      });

        if (!response.ok) throw new Error("Failed to create a new meal plan");

      console.log("New plan created:", await response.json());
      
      await fetchMealPlans();

    } catch (error) {
      console.error('Error adding meal plan:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg mt-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Weekly Meal Plan</h2>

      {/* Dropdown for past meal plans */}
      <div className="mb-4">
        <label htmlFor="mealPlanSelect"className="font-semibold">Select Plan: </label>
        <select
          id="mealPlanSelect"
          value={selectedPlanId ?? ""}
          onChange={(e) => { 
            const selectedId = Number(e.target.value);
            setSelectedPlanId(selectedId);

            const selectedPlan = mealPlans.flat().filter(plan => plan.plan_id === selectedId);
            setSelectedMealPlan(selectedPlan);
            
          }}
          className="border rounded p-2 ml-2"
          aria-label="Select a past meal plan"
          title="Select a past meal plan"
        >
          <option value="" disabled>Select a plan</option>
          {pastMealPlans.map(({ date, plan_id }) => (
            <option key={plan_id} value={plan_id}>
              {new Date(date + "T00:00:00").toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>
          
      {/* Meal Plan View */}
      { <MealPlanView selectedMealPlan={selectedMealPlan} /> }

      {/* Start New Plan Button */}
      <div className="mt-6">
        <button type="button" onClick={startNewPlan} className="bg-accent text-white px-4 py-2 rounded">
          Start New Meal Plan
        </button>
      </div>
    </div>
  );
}

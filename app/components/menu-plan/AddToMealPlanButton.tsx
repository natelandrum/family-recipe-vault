'use client'
import { useEffect, useState } from "react";
import { useUser } from "@/app/lib/hooks/useUser";
import AddRecipeModal from "./AddRecipeModal";
import { getMealPlansByUserId } from "@/app/lib/data";
import { MealPlan } from "@/app/lib/definitions";

interface AddToMealPlanButtonProps {
  recipeId: number;
  recipeName: string;
}

const AddToMealPlanButton: React.FC<AddToMealPlanButtonProps> = ({ recipeId, recipeName }) => {
  const [showModal, setShowModal] = useState(false); 
  const { user } = useUser();
  // const [availableDates, setAvailableDates] = useState<string[]>([]); // Properly initialize state
  const [userMealPlans, setUserMealPlans] = useState<MealPlan[]>([]);

  console.log("fetched Meal Plans:", userMealPlans.flat())


  useEffect(() => {
    if (!user?.id) return; // Ensure user is available before fetching

    const fetchMealPlans = async () => {
      try {
        const fetchedMealPlans = await getMealPlansByUserId(user.id);
        setUserMealPlans(fetchedMealPlans)
        console.log("this is fetched data:", fetchedMealPlans.flat())
        // const fetchedDates = fetchedMealPlans.map(plan => plan.date.toISOString().split('T')[0]);
        // setAvailableDates(fetchedDates);
      } catch (error) {
        console.error("Error fetching meal plans:", error);
      }
    };

    fetchMealPlans();
  }, [user?.id]); // Dependency array ensures fetch runs when user.id is set

  if (!user) return null; 

  return (
    <div>
      {/* Button to open modal */}
      <button
        type="button"
        onClick={() => setShowModal(true)} // Show the modal on button click
        className="bg-accent text-white px-4 py-2 rounded-md shadow-lg"
      >
        Add {recipeName} to Meal Plan
      </button>

      {/* AddRecipeModal is used here with showModal state */}
      <AddRecipeModal
        show={showModal}
        onClose={() => setShowModal(false)} // Close the modal
        recipeId={recipeId}
        recipeName={recipeName}
        userMealPlans={userMealPlans}
      />
    </div>
  );
};

export default AddToMealPlanButton;

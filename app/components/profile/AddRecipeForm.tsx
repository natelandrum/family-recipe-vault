"use client";

import axios from "axios";
import { useState, startTransition } from "react";
import { RecipeState, validateRecipeForm } from "@/app/lib/actions";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import DragNDrop from "@/app/components/media/ImageDragNDrop";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";

interface AddRecipeFormProps {
  currentAdd: { currentAdd: boolean };
  userId: number;
}

export default function AddRecipeForm({ currentAdd, userId }: AddRecipeFormProps) {
  // Image File State
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form Visibility State
  const [isVisible, setIsVisible] = useState(currentAdd.currentAdd);

  // Initialize Recipe State
  const [state, setState] = useState({
    errors: {},
    message: null,
  } as RecipeState);

  // Recipe, Ingredients, and Tags State
  const [recipeInfo, setRecipeInfo] = useState({
    name: "",
    servings: 1,
    description: "",
    instructions: [""],
    mealType: "Breakfast",
    privacyStatus: "Community",
  });

  const [ingredients, setIngredients] = useState([
    {
      ingredientName: "",
      quantity: 1,
      unit: "",
      preparationMethod: "",
    },
  ]);

  const [tags, setTags] = useState([{ tagName: "" }]);

  const [activeTab, setActiveTab] = useState("recipe");

  // Handle File Upload
  const handleFileUpload = (file: File) => {
    setImageFile(file);
  };

  // Handle Recipe Info Change
  const handleRecipeInfoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 1000) {

      return;
    } else {
          setRecipeInfo((prev) => ({ ...prev, [name]: value }));

    }
    
  };

  // Handle Instruction Change
  const handleInstructionChange = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setRecipeInfo((prev) => {
      const newInstructions = [...prev.instructions];
      newInstructions[index] = value;
      return { ...prev, instructions: newInstructions };
    });
  };

  // Add New Instruction
  const addInstruction = () => {
    setRecipeInfo((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  // Remove Instruction
  const removeInstruction = (index: number) => {
    setRecipeInfo((prev) => {
      if (prev.instructions.length > 1) {
        const newInstructions = [...prev.instructions];
        newInstructions.splice(index, 1);
        return { ...prev, instructions: newInstructions };
      }
      return prev;
    });
  };

  // Handle Ingredient Change
  const handleIngredientChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setIngredients((prev) =>
      prev.map((ingredient, i) =>
        i === index ? { ...ingredient, [name]: value } : ingredient
      )
    );
  };

  // Add New Ingredient
  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      {
        ingredientName: "",
        quantity: 1,
        unit: "",
        preparationMethod: "",
      },
    ]);
  };

  // Remove Ingredient
  const removeIngredient = (index: number) => {
    setIngredients((prev) => {
      if (prev.length > 1) {
        const newIngredients = [...prev];
        newIngredients.splice(index, 1);
        return newIngredients;
      }
      return prev;
    });
  };

  // Handle Tag Change
  const handleTagChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setTags((prev) =>
      prev.map((tag, i) => (i === index ? { tagName: value } : tag))
    );
  };

  // Add New Tag
  const addTag = () => {
    setTags((prev) => [...prev, { tagName: "" }]);
  };

  // Remove Tag
  const removeTag = (index: number) => {
    setTags((prev) => {
      if (prev.length > 1) {
        const newTags = [...prev];
        newTags.splice(index, 1);
        return newTags;
      }
      return prev;
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", recipeInfo.name);
    formData.append("servings", recipeInfo.servings.toString());
    formData.append("description", recipeInfo.description);
    recipeInfo.instructions.forEach((instruction) =>
      formData.append("instructions", instruction)
    );
    formData.append("mealType", recipeInfo.mealType);
    formData.append("privacyStatus", recipeInfo.privacyStatus);
    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", "");
    }
    ingredients.forEach((ingredient) => {
      formData.append("ingredients", JSON.stringify(ingredient));
    });
    tags.forEach((tag) => {
      formData.append("tags", JSON.stringify(tag));
    });
    // Validate Form
    startTransition(() => {
      validateRecipeForm(state, formData).then(async (validatedState) => {
        setState(validatedState);

        // If no errors, submit form
        if (
          validatedState.errors &&
          Object.keys(validatedState.errors).length === 0
        ) {
          if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onloadend = async () => {
              const response = await axios.post("/api/image-upload", {
                file: reader.result,
              });
              const uploadedUrl = response.data.url;

              const recipeResponse = await fetch("/api/add-recipe", {
                method: "POST",
                body: JSON.stringify({
                  ...recipeInfo,
                  imageUrl: uploadedUrl,
                  userId,
                  created: new Date().toISOString(),
                }),
              });

              if (!recipeResponse.ok) {
                throw new Error("Failed to add recipe");
              }
              const recipeIdJson = await recipeResponse.json();
              const recipeId = recipeIdJson.recipeId;
              const ingredientResponse = await fetch("/api/add-ingredient", {
                method: "POST",
                body: JSON.stringify({
                  recipeId,
                  ingredients,
                }),
              });
              if (!ingredientResponse.ok) {
                throw new Error("Failed to add ingredients");
              }
              const tagResponse = await fetch("/api/add-tag", {
                method: "POST",
                body: JSON.stringify({
                  recipeId,
                  tags,
                }),
              });
              if (!tagResponse.ok) {
                throw new Error("Failed to add tags");
              }
              // Reset Form
              setRecipeInfo({
                name: "",
                servings: 1,
                description: "",
                instructions: [""],
                mealType: "Breakfast",
                privacyStatus: "Community",
              });
              setIngredients([
                {
                  ingredientName: "",
                  quantity: 1,
                  unit: "",
                  preparationMethod: "",
                },
              ]);
              setTags([{ tagName: "" }]);
              setImageFile(null);
              setIsVisible(false);
            };
          }
          
        } else {
          console.log("Validation errors:", validatedState.errors);
        }
      });
    });    
  };

  return (
    isVisible && (
      <div className="p-6 max-w-4xl mx-auto m-8 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Add Recipe</h1>

        <div className="border-b mb-4">
          <nav className="flex space-x-4">
            <button
              type="button"
              className={`pb-2 ${
                activeTab === "recipe"
                  ? "border-b-2 border-blue-500 font-bold"
                  : ""
              }`}
              onClick={() => setActiveTab("recipe")}
            >
              Recipe Information
            </button>
            <button
              type="button"
              className={`pb-2 ${
                activeTab === "ingredients"
                  ? "border-b-2 border-blue-500 font-bold"
                  : ""
              }`}
              onClick={() => setActiveTab("ingredients")}
            >
              Ingredients
            </button>
            <button
              type="button"
              className={`pb-2 ${
                activeTab === "tags"
                  ? "border-b-2 border-blue-500 font-bold"
                  : ""
              }`}
              onClick={() => setActiveTab("tags")}
            >
              Tags
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === "recipe" && (
            <div>
              <div>
                {imageFile && (
                  <div className="mb-4">
                    <Image
                      src={URL.createObjectURL(imageFile)}
                      alt="Selected Recipe Image"
                      style={
                        {
                          width: "auto",
                          height: "200px",
                        }
                      }
                    />
                  </div>
                )}
              </div>
              <DragNDrop onUpload={handleFileUpload} />
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Recipe Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={recipeInfo.name}
                  onChange={handleRecipeInfoChange}
                  required
                  className="w-full p-3 border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="servings"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Servings
                </label>
                <input
                  id="servings"
                  type="number"
                  name="servings"
                  value={recipeInfo.servings}
                  onChange={handleRecipeInfoChange}
                  required
                  className="w-full p-3 border rounded"
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Description
                </label>
                <div className="relative">
                  <textarea
                  id="description"
                  name="description"
                  value={recipeInfo.description}
                  onChange={handleRecipeInfoChange}
                  required
                  className="w-full p-3 border rounded"
                  />
                  <p className="absolute right-2 text-gray-500">
                    {recipeInfo.description.length} / 1000
                  </p>
                </div>
                
              </div>
              <div className="mb-4">
                {recipeInfo.instructions.map((instruction, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor={`instruction-${index}`}
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Instruction {index + 1}
                    </label>
                    <textarea
                      id={`instruction-${index}`}
                      name={`instruction-${index}`}
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e)}
                      required
                      className="w-full p-3 border rounded"
                    />
                    <div className="mt-4">
                      <Button
                        onClick={() => removeInstruction(index)}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                      >
                        Remove Instruction
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addInstruction}
                  variant="contained"
                  color="success"
                >
                  Add Instruction
                </Button>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="mealType"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Meal Type
                </label>
                <select
                  id="mealType"
                  name="mealType"
                  value={recipeInfo.mealType}
                  onChange={handleRecipeInfoChange}
                  required
                  className="w-full p-3 border rounded"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="privacyStatus"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Privacy Status
                </label>
                <select
                  id="privacyStatus"
                  name="privacyStatus"
                  value={recipeInfo.privacyStatus}
                  onChange={handleRecipeInfoChange}
                  required
                  className="w-full p-3 border rounded"
                >
                  <option value="Community">Community</option>
                  <option value="Private">Private</option>
                  <option value="Family">Family</option>
                </select>
              </div>
              <Button
                onClick={() => setActiveTab("ingredients")}
                className="mt-4 mr-4 px-4 py-2 rounded"
                endIcon={<ChevronRightIcon />}
                variant="outlined"
              >
                Next
              </Button>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="mb-4">
                  <label
                    htmlFor="ingredientName"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Ingredient Name
                  </label>
                  <input
                    id="ingredientName"
                    type="text"
                    name="ingredientName"
                    value={ingredient.ingredientName}
                    onChange={(e) => handleIngredientChange(index, e)}
                    required
                    className="w-full p-3 border rounded"
                  />
                  <label
                    htmlFor="quantity"
                    className="block text-gray-700 font-medium mb-1 mt-2"
                  >
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    step="0.01"
                    name="quantity"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, e)}
                    required
                    className="w-full p-3 border rounded"
                  />
                  <label
                    htmlFor="unit"
                    className="block text-gray-700 font-medium mb-1 mt-2"
                  >
                    Unit
                  </label>
                  <input
                    id="unit"
                    type="text"
                    name="unit"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, e)}
                    required
                    className="w-full p-3 border rounded"
                  />
                  <label
                    htmlFor="preparationMethod"
                    className="block text-gray-700 font-medium mb-1 mt-2"
                  >
                    Preparation Method
                  </label>
                  <input
                    id="preparationMethod"
                    type="text"
                    name="preparationMethod"
                    value={ingredient.preparationMethod}
                    onChange={(e) => handleIngredientChange(index, e)}
                    placeholder="Optional"
                    className="w-full p-3 border rounded"
                  />
                  <div className="mt-4">
                    <Button
                      onClick={() => removeIngredient(index)}
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Remove Ingredient
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                onClick={addIngredient}
                variant="contained"
                color="success"
              >
                Add Ingredient
              </Button>
              <div className="w-[300px] flex justify-between mt-4">
                <Button
                  className=" px-4 py-2 rounded"
                  onClick={() => setActiveTab("recipe")}
                  startIcon={<ChevronLeftIcon />}
                  variant="outlined"
                >
                  Previous
                </Button>
                <Button
                  className="mt-4 mr-4 px-4 py-2 rounded"
                  onClick={() => setActiveTab("tags")}
                  endIcon={<ChevronRightIcon />}
                  variant="outlined"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {activeTab === "tags" && (
            <div>
              {tags.map((tag, index) => (
                <div key={index} className="mb-4">
                  <label
                    htmlFor="tagName"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Tag Name
                  </label>
                  <input
                    id="tagName"
                    type="text"
                    name="tagName"
                    value={tag.tagName}
                    onChange={(e) => handleTagChange(index, e)}
                    className="w-full p-3 border rounded"
                  />
                  <div className="mt-4">
                    <Button
                      onClick={() => removeTag(index)}
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Remove Tag
                    </Button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Tag
              </button>
              <div className="mt-4">
                <Button
                  className=" px-4 py-2 rounded"
                  onClick={() => setActiveTab("ingredients")}
                  startIcon={<ChevronLeftIcon />}
                  variant="outlined"
                >
                  Previous
                </Button>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="w-60 bg-green-500 hover:bg-green-700 text-white px-4 py-3 rounded mt-6"
                >
                  Submit Recipe
                </button>
              </div>
            </div>
          )}
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors &&
              Object.entries(state.errors).map(([field, errors]) => (
                <div key={field}>
                  {errors &&
                    errors.map((error, index) => {
                      return (
                        <p
                          key={`${error}-${index}`}
                          className="mt-2 text-sm text-red-500"
                        >
                          {error}
                        </p>
                      );
                    })}
                </div>
              ))}
          </div>
        </form>
      </div>
    )
  );
}

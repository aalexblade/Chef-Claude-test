import React, { useState, useEffect, useRef } from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromChefClaude } from "../ai";

export default function Main() {
  const [ingredients, setIngredients] = useState([
    "chicken",
    "all the main spices",
    "corn",
    "heavy cream",
    "pasta",
  ]);
  const [recipe, setRecipe] = useState("");
  const [inputIngredient, setInputIngredient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duplicateError, setDuplicateError] = useState(null); 
  
  const recipeSection = useRef(null);
  const inputRef = useRef(null); // Reference for input autofocus

  useEffect(() => {
    // Scroll effect when a new recipe is received
    if (recipe !== "" && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  async function getRecipe() {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient!");
      return;
    }

    setIsLoading(true);
    setRecipe(""); 
    setError(null);
    setDuplicateError(null);

    try {
      const recipeMarkdown = await getRecipeFromChefClaude(ingredients);
      setRecipe(recipeMarkdown);
    } catch (e) {
      console.error("Error fetching recipe from Claude:", e);
      setError("An error occurred while fetching the recipe. Check your connection or try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  function addIngredient(e) {
    e.preventDefault(); 
    const newIngredient = inputIngredient.trim();

    setDuplicateError(null);
    setError(null); 

    if (newIngredient === "") {
      return;
    }

    // 1. Check for invalid characters (letters only)
    if (!/[a-zA-Z]/.test(newIngredient)) {
        setError("Ingredient must contain letters (A-Z).");
        return;
    }

    // 2. Check for ingredient limit (e.g., 10 items max)
    const MAX_INGREDIENTS = 10;
    if (ingredients.length >= MAX_INGREDIENTS) {
      setError(`Maximum ${MAX_INGREDIENTS} ingredients allowed. Please clear some.`);
      return;
    }

    // Normalize for case-insensitive duplicate check
    const normalizedNewIngredient = newIngredient.toLowerCase();
    
    // 3. DUPLICATE CHECK
    const isDuplicate = ingredients.some(
      (ing) => ing.toLowerCase() === normalizedNewIngredient
    );

    if (isDuplicate) {
      setDuplicateError(`Ingredient "${newIngredient}" is already in your list.`);
      return; 
    }

    // Add ingredient and auto-focus
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    setInputIngredient(''); 
    inputRef.current.focus(); // Set focus back to input
  }

  function removeIngredient(ingredientToRemove) {
    setIngredients((prevIngredients) => 
      prevIngredients.filter((ing) => ing !== ingredientToRemove)
    );
    setRecipe(""); 
    setError(null);
    setDuplicateError(null);
  }

  // 4. Function to clear all ingredients
  function clearIngredients() {
    setIngredients([]);
    setRecipe("");
    setError(null);
    setDuplicateError(null);
    inputRef.current.focus();
  }


  return (
    <main>
      <form onSubmit={addIngredient} className="add-ingredient-form">
        <input
          ref={inputRef} // Attach ref for autofocus
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
          value={inputIngredient}
          onChange={(e) => setInputIngredient(e.target.value)}
        />
        <button disabled={inputIngredient.trim() === ''}>Add ingredient</button>
      </form>

      {/* Display errors and warnings */}
      {error && <div className="error-message">❌ {error}</div>}
      {duplicateError && <div className="error-message warning">⚠️ {duplicateError}</div>}
      
      {ingredients.length > 0 && (
        <IngredientsList 
          ingredients={ingredients} 
          getRecipe={getRecipe} 
          removeIngredient={removeIngredient} 
          isLoading={isLoading} 
          clearIngredients={clearIngredients} // Pass clear function
        />
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="loading-message">
            🧑‍🍳 Chef Claude is cooking up a recipe...
        </div>
      )}

      {recipe && !isLoading && (
        <div ref={recipeSection}>
          <ClaudeRecipe recipe={recipe} />
        </div>
      )}
    </main>
  );
}
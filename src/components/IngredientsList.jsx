import React from "react";

export default function IngredientsList({
  ingredients,
  getRecipe,
  removeIngredient,
  isLoading,
  clearIngredients,
}) {
  const handleGetRecipe = () => {
    if (!isLoading) {
      getRecipe();
    }
  };

  const ingredientsListItems = ingredients.map((ingredient, index) => (
    <li key={index} className="ingredient-item">
      <span className="ingredient-name">{ingredient}</span>
      <button
        onClick={() => removeIngredient(ingredient)}
        aria-label={`Remove ${ingredient}`}
        className="remove-ingredient-btn"
        disabled={isLoading}
      >
        &times;
      </button>
    </li>
  ));

  if (ingredients.length === 0) {
    return (
      <section>
        <h2>Ingredients on Hand:</h2>
        <p>Please add ingredients to get a recipe!</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Ingredients on Hand:</h2>
      <ul className="ingredients-list" aria-live="polite">
        {ingredientsListItems}
      </ul>

      <div className="ingredients-actions">
        {" "}
        {/* New container for action buttons */}
        {/* Clear List Button */}
        <button
          onClick={clearIngredients}
          disabled={isLoading}
          className="clear-ingredients-btn"
        >
          Clear List ({ingredients.length})
        </button>
        {/* Get Recipe Button */}
        <button
          onClick={handleGetRecipe}
          disabled={isLoading}
          className="get-recipe-btn"
        >
          {isLoading ? "Generating..." : "Get a Recipe"}
        </button>
      </div>
    </section>
  );
}

import React from "react";

export default function IngredientsList({
  ingredients,
  getRecipe,
  removeIngredient,
  isLoading,
  clearIngredients,
}) {
  const MIN_INGREDIENTS = 5; // Встановлюємо мінімально необхідну кількість інгредієнтів
  
  // Визначаємо, чи має бути активна кнопка "Get a Recipe"
  const isGetRecipeDisabled = isLoading || ingredients.length < MIN_INGREDIENTS;

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
          // !!! ЗАСТОСОВУЄМО ЛОГІКУ ВИМКНЕННЯ КНОПКИ !!!
          disabled={isGetRecipeDisabled} 
          className="get-recipe-btn"
        >
          {isLoading 
            ? "Generating..." 
            : ingredients.length < MIN_INGREDIENTS 
              ? `Add ${MIN_INGREDIENTS - ingredients.length} more ingredient${MIN_INGREDIENTS - ingredients.length > 1 ? 's' : ''}` // Інформативне повідомлення
              : "Get a Recipe"
          }
        </button>
      </div>
      {/* Додамо повідомлення для користувача, якщо інгредієнтів менше 5 */}
      {ingredients.length < MIN_INGREDIENTS && (
        <p className="hint-message">
          💡 Add at least **{MIN_INGREDIENTS - ingredients.length}** more ingredients to get a recipe.
        </p>
      )}
    </section>
  );
}
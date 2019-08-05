import React, { useReducer, useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      return [...state, action.payload];
    case "DELETE":
      state.filter(ing => ing.id !== action.payload.id);
      break;
    default:
      throw Error("should not get there");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(reducer, []);
  //const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  console.log("user ingredients:", userIngredients);
  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //   setUserIngredients(filteredIngredients);
    dispatch({ type: "SET", payload: filteredIngredients });
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch("https://test-project-f986f.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        setIsLoading(false);
        return response.json();
      })
      .then(responseData => {
        /*         setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]); */
        dispatch({
          type: "ADD",
          payload: { id: responseData.name, ...ingredient }
        });
      });
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(
      `https://test-project-f986f.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE"
      }
    )
      .then(response => {
        setIsLoading(false);
        //  setUserIngredients(prevIngredients =>
        //     prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        //    );
        dispatch({ type: "DELETE", payload: { id: ingredientId } });
      })
      .catch(error => {
        setError("Something went wrong!");
        setIsLoading(false);
      });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;

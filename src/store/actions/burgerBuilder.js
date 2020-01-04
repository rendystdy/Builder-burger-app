import {
  ADD_INGREDIENT,
  REMOVE_INGREDIENT,
  SET_INGRIDIENTS,
  FETCH_INGREDIENTS_FAILED
} from './actionTypes';
import axios from '../../axios-orders';

const addIngredient = name => {
  return {
    type: ADD_INGREDIENT,
    ingredientName: name
  };
};

const removeIngredient = name => {
  return {
    type: REMOVE_INGREDIENT,
    ingredientName: name
  };
};

const setIngredients = ingredients => {
  return {
    type: SET_INGRIDIENTS,
    ingredients: ingredients
  };
};

const fetchIngredientsFailed = () => {
  return {
    type: FETCH_INGREDIENTS_FAILED
  };
};

const initIngredients = () => {
  return dispatch => {
    axios
      .get('/ingredients.json')
      .then(response => {
        dispatch(setIngredients(response.data));
      })
      .catch(error => {
        dispatch(fetchIngredientsFailed());
      });
  };
};

export {
  addIngredient,
  removeIngredient,
  initIngredients,
  setIngredients,
  fetchIngredientsFailed
};

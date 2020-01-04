import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  building: false
};

const INGREDIENTS_PRICE = {
  salad: 0.5,
  bacon: 0.4,
  cheese: 1.3,
  meat: 0.7
};

const addIngridient = (state, action) => {
  const updatedIngridient = {
    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
  };
  const updatedIngridients = updateObject(state.ingredients, updatedIngridient);
  const updateState = {
    ingredients: updatedIngridients,
    totalPrice: state.totalPrice + INGREDIENTS_PRICE[action.ingredientName],
    building: true
  };
  return updateObject(state, updateState);
};

const removeIngridient = (state, action) => {
  const updatedIng = {
    [action.ingredientName]: state.ingredients[action.ingredientName] - 1
  };
  const updatedIngs = updateObject(state.ingredients, updatedIng);
  const updateSt = {
    ingredients: updatedIngs,
    totalPrice: state.totalPrice + INGREDIENTS_PRICE[action.ingredientName],
    building: true
  };
  return updateObject(state, updateSt);
};

const setIngridients = (state, action) => {
  return updateObject(state, {
    ingredients: {
      salad: action.ingredients.salad,
      bacon: action.ingredients.bacon,
      cheese: action.ingredients.cheese,
      meat: action.ingredients.meat
    },
    totalPrice: 4,
    error: false,
    building: false
  });
};

const fetchIngridientsFailed = (state, action) => {
  return updateObject(state, { error: true });
};

const ingredientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return addIngridient(state, action);
    case actionTypes.REMOVE_INGREDIENT:
      return removeIngridient(state, action);
    case actionTypes.SET_INGRIDIENTS:
      return setIngridients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return fetchIngridientsFailed(state, action);
    default:
      return state;
  }
};

export default ingredientsReducer;

import { combineReducers } from 'redux';
import burgerBuilder from './burgerBuilder';
import orders from './orders';
import auth from './auth';

const rootReducer = combineReducers({
  ingredients: burgerBuilder,
  orders: orders,
  auth: auth
});

export default rootReducer;

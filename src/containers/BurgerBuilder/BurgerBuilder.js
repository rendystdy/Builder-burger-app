import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandling from '../../hoc/withErrorHandling/withErrorHandling';
import {
  addIngredient,
  removeIngredient,
  initIngredients,
  purchaseInit,
  setAuthRedirectPath
} from '../../store/actions/';
import axios from '../../axios-orders';

const BurgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false);

  const ingredients = useSelector(state => {
    return state.ingredients.ingredients;
  });

  const totalPrice = useSelector(state => {
    return state.ingredients.totalPrice;
  });

  const error = useSelector(state => {
    return state.ingredients.error;
  });

  const isAuthenticated = useSelector(state => {
    return state.auth.token !== null;
  });

  const dispatch = useDispatch();

  const onAddIngredient = ingName => dispatch(addIngredient(ingName));
  const onRemoveIngredient = ingName => dispatch(removeIngredient(ingName));
  const onInitPurchase = () => dispatch(purchaseInit());
  const onInitIngridients = useCallback(() => dispatch(initIngredients()), [
    dispatch
  ]);
  const onSetAuthRedirectPath = path => dispatch(setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngridients();
  }, [onInitIngridients]);

  const updatePurchaseState = updateIngredients => {
    const sum = Object.keys(updateIngredients)
      .map(igKey => {
        return updateIngredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  };

  const purchaseHandler = () => {
    const {
      history: { push }
    } = props;

    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout');
      push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    const {
      history: { push }
    } = props;

    onInitPurchase();
    push('/checkout');
  };

  const disabledInfo = {
    ...ingredients
  };

  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  let orderSummary = null;

  let burger = error ? (
    <p style={{ textAlign: 'center' }}>ingredients can't be loaded!!!</p>
  ) : (
    <Spinner />
  );

  if (ingredients) {
    burger = (
      <Aux>
        <Burger ingredients={ingredients} />
        <BuildControls
          isAuth={isAuthenticated}
          ingredientsAdded={onAddIngredient}
          ingredientsRemove={onRemoveIngredient}
          disabled={disabledInfo}
          price={totalPrice}
          purchaseble={updatePurchaseState(ingredients)}
          ordered={purchaseHandler}
        />
      </Aux>
    );
    orderSummary = (
      <OrderSummary
        ingredients={ingredients}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
        price={totalPrice}
      />
    );
  }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
};

export default withErrorHandling(BurgerBuilder, axios);

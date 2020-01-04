import React, { Component } from 'react';
import { connect } from 'react-redux';

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

export class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchasing: false
    };
  }

  componentDidMount() {
    const { onInitIngridients } = this.props;
    onInitIngridients();
  }

  updatePurchaseState = updateIngredients => {
    const sum = Object.keys(updateIngredients)
      .map(igKey => {
        return updateIngredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  };

  purchaseHandler = () => {
    const {
      isAuthenticated,
      history: { push },
      onSetAuthRedirectPath
    } = this.props;
    if (isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      onSetAuthRedirectPath('/checkout')
      push('/auth');
    }
  };

  purchaseCancellHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    const {
      history: { push },
      onInitPurchase
    } = this.props;

    onInitPurchase();
    push('/checkout');
  };

  render() {
    const { purchasing } = this.state;
    const {
      ingredients,
      onAddIngredient,
      onRemoveIngredient,
      totalPrice,
      error,
      isAuthenticated
    } = this.props;
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
            purchaseble={this.updatePurchaseState(ingredients)}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={ingredients}
          purchaseCancelled={this.purchaseCancellHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={totalPrice}
        />
      );
    }

    return (
      <Aux>
        <Modal show={purchasing} modalClosed={this.purchaseCancellHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.ingredients.ingredients,
    totalPrice: state.ingredients.totalPrice,
    error: state.ingredients.error,
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddIngredient: ingName => dispatch(addIngredient(ingName)),
    onRemoveIngredient: ingName => dispatch(removeIngredient(ingName)),
    onInitIngridients: ingredients => dispatch(initIngredients()),
    onInitPurchase: () => dispatch(purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(setAuthRedirectPath(path))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandling(BurgerBuilder, axios));

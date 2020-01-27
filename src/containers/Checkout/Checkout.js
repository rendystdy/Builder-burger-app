import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
// import { purchaseInit } from '../../store/actions/index';

const Checkout = props => {
  // componentDidMount() {
  // const {
  //   // location: { search }
  //   onInitPurchase
  // } = this.props;
  // onInitPurchase();
  // const searchParams = new URLSearchParams(search);
  // const ingredients = {};
  // let price = 0;
  // for (let param of searchParams.entries()) {
  //   if (param[0] === 'price') {
  //     price = param[1]
  //   } else {
  //     ingredients[param[0]] = +param[1];
  //   }
  // }
  // this.setState({
  //   ingredients,
  //   totalPrice: price
  // });
  // }

  const checkoutCancelledHandler = () => {
    const {
      history: { goBack }
    } = props;
    goBack();
  };

  const checkoutContinuedHandler = () => {
    const {
      history: { replace }
    } = props;

    replace('/checkout/contact-data');
  };

  const {
    match: { path },
    ingredients,
    purchased
  } = props;
  let summary = <Redirect to='/' />;
  if (ingredients) {
    const purchasedRedirect = purchased ? <Redirect to='/' /> : null;
    summary = (
      <div>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={ingredients}
          checkoutCancelled={checkoutCancelledHandler}
          checkoutContinued={checkoutContinuedHandler}
        />
        <Route path={`${path}/contact-data`} component={ContactData} />
      </div>
    );
  }
  return summary;
};

const mapStateToProps = state => {
  return {
    ingredients: state.ingredients.ingredients,
    purchased: state.orders.purchased
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     onInitPurchase: () => dispatch(purchaseInit())
//   };
// };

export default connect(mapStateToProps, null)(Checkout);

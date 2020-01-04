import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
// import { purchaseInit } from '../../store/actions/index';

class Checkout extends Component {
  componentDidMount() {
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
  }

  checkoutCancelledHandler = () => {
    const {
      history: { goBack }
    } = this.props;
    goBack();
  };

  checkoutContinuedHandler = () => {
    const {
      history: { replace }
    } = this.props;

    replace('/checkout/contact-data');
  };

  render() {
    const {
      match: { path },
      ingredients,
      purchased
    } = this.props;
    let summary = <Redirect to='/' />;
    if (ingredients) {
      const purchasedRedirect = purchased ? <Redirect to='/' /> : null;
      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={ingredients}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route path={`${path}/contact-data`} component={ContactData} />
        </div>
      );
    }
    return summary;
  }
}

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

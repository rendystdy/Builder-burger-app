import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandling from '../../../hoc/withErrorHandling/withErrorHandling';
import { purchaseBurger } from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Zip Code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email ',
          placeholder: 'Your Email'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deleveryMethode: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest' }
          ]
        },
        validation: {},
        value: 'fastest',
        valid: true
      }
    },
    formIsValid: false
  };

  orderHandler = event => {
    event.preventDefault();
    const { ingredients, price, onOrderBurger, token, userId } = this.props;
    const { orderForm } = this.state;
    // this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in orderForm) {
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
    }

    const order = {
      ingredients: ingredients,
      price: price,
      orderData: formData,
      userId: userId
    };

    onOrderBurger(order, token);
    // axios
    //   .post('/orders.json', order)
    //   .then(response => {
    //     const {
    //       history: { push }
    //     } = this.props;
    //     this.setState({ loading: false });
    //     push('/');
    //   })
    //   .catch(error => {
    //     this.setState({ loading: false });
    //   });
  };

  inputChangedHandler = (e, inputIndentifier) => {
    const { orderForm } = this.state;

    const updateFormElement = updateObject(orderForm[inputIndentifier], {
      value: e.target.value,
      valid: checkValidity(
        e.target.value,
        orderForm[inputIndentifier].validation
      ),
      touched: true
    });

    const updateOrderForm = updateObject(orderForm, {
      [inputIndentifier]: updateFormElement
    });
    // updateFormElement.value = e.target.value;
    // updateFormElement.valid = this.checkValidity(
    //   updateFormElement.value,
    //   updateFormElement.validation
    // );
    // updateFormElement.touched = true;

    // updateOrderForm[inputIndentifier] = updateFormElement;

    let formIsValiders = true;

    for (let inputIndentifier in updateOrderForm) {
      formIsValiders =
        updateOrderForm[inputIndentifier].valid && formIsValiders;
    }

    this.setState({
      orderForm: updateOrderForm,
      formIsValid: formIsValiders
    });
  };

  render() {
    const { orderForm, formIsValid } = this.state;
    const { loading } = this.props;
    const formElementArray = [];

    for (const key in orderForm) {
      formElementArray.push({
        id: key,
        config: orderForm[key]
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementArray.map(formElement => {
          const {
            config: {
              elementType,
              elementConfig,
              value,
              valid,
              validation,
              touched
            },
            id
          } = formElement;

          return (
            <Input
              key={id}
              elementType={elementType}
              elementConfig={elementConfig}
              value={value}
              invalid={!valid}
              shouldValidate={validation}
              touched={touched}
              changed={event => this.inputChangedHandler(event, id)}
            />
          );
        })}
        <Button disabled={!formIsValid} btnType='Success' t>
          ORDER
        </Button>
      </form>
    );

    if (loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter Your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.ingredients.ingredients,
    price: state.ingredients,
    loading: state.orders.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(purchaseBurger(orderData, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandling(ContactData, axios));

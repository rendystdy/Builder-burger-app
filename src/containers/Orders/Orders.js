import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandling from '../../hoc/withErrorHandling/withErrorHandling';
import Spinner from '../../components/UI/Spinner/Spinner';
import { fetchOrders } from '../../store/actions/index';

const Orders = props => {
  const { onFetchOrders, token, userId } = props;
  useEffect(() => {
    onFetchOrders(token, userId);
  }, [onFetchOrders, token, userId]);
  // axios
  //   .get('/orders.json')
  //   .then(response => {
  //     const fetchOrders = [];
  //     for (const key in response.data) {
  //       fetchOrders.push({
  //         ...response.data[key],
  //         id: key
  //       });
  //     }
  //     this.setState({
  //       orders: fetchOrders,
  //       loading: false
  //     });
  //   })
  //   .catch(error => {
  //     this.setState({ error: true, loading: false });
  //   });
  // const { onFetchOrders, token, userId } = this.props;
  // onFetchOrders(token, userId);
  // }
  const { orders, loading } = props;

  let getOrders = <Spinner />;

  if (!loading) {
    getOrders = orders.map(order => {
      return (
        <Order
          key={order.id}
          ingredients={order.ingredients}
          price={order.price.totalPrice}
        />
      );
    });
  }

  return <div>{getOrders}</div>;
};

const mapStateToProps = state => {
  return {
    orders: state.orders.orders,
    loading: state.orders.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) => dispatch(fetchOrders(token, userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandling(Orders, axios));

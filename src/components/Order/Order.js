import React from 'react';

import classes from './Order.module.css';

const Order = props => {
  const { price, ingredients } = props;

  const getIngredients = [];

  for (let ingredientsName in ingredients) {
    getIngredients.push({
      name: ingredientsName,
      amount: ingredients[ingredientsName]
    });
  }

  const ingredientsOutput = getIngredients.map(ig => {
    return (
      <span
        style={{
          textTransform: 'capitalize',
          display: 'inline-block',
          margin: '0 8px',
          border: '1px solid #ccc',
          padding: '5px'
        }}
        key={ig.name}
      >
        {ig.name} ({ig.amount}){' '}
      </span>
    );
  });

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientsOutput}</p>
      <p>
        Price: <strong>USD {Number.parseFloat(price).toFixed(2)}</strong>
      </p>
    </div>
  );
};

export default Order;

import React from 'react';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = props => {
  const { isAuthenticated } = props;
  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link='/' exact>
        Burger Builder
      </NavigationItem>
      {isAuthenticated ? (
        <NavigationItem link='/orders'>Orders</NavigationItem>
      ) : null}
      {!isAuthenticated ? (
        <NavigationItem link='/auth'>Authenticated</NavigationItem>
      ) : (
        <NavigationItem link='/logout'>Logout</NavigationItem>
      )}
    </ul>
  );
};

export default NavigationItems;

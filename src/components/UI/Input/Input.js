import React from 'react';

import classes from './Input.module.css';

const Input = props => {
  const {
    value,
    elementConfig,
    elementConfig: { options },
    changed
  } = props;
  
  let inputElement = null;
  const inputClasses = [classes.InputElement];
  let validationError = null;

  if (props.invalid && props.touched) {
      validationError = <p className={classes.ValidationError} >Please enter a valid {value}!</p>
  }

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }

  switch (props.elementType) {
    case 'input':
      inputElement = (
        <input
          className={inputClasses.join(' ')}
          {...elementConfig}
          value={value}
          onChange={changed}
        />
      );
      break;
    case 'textarea':
      inputElement = (
        <textarea
          className={inputClasses.join(' ')}
          {...elementConfig}
          value={value}
          onChange={changed}
        />
      );
      break;
    case 'select':
      inputElement = (
        <select
          className={inputClasses.join(' ')}
          {...elementConfig}
          value={value}
          onChange={changed}
        >
          {options.map(option => {
            return (
              <option key={option.value} value={option.value}>
                {option.displayValue}
              </option>
            );
          })}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(' ')}
          value={value}
          onChange={changed}
        />
      );
      break;
  }
  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
      {validationError}
    </div>
  );
};

export default Input;

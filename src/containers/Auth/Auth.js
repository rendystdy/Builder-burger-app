import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import { auth, setAuthRedirectPath } from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail Address '
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    isSignUp: true
  };

  componentDidMount() {
    const {
      buildingBurger,
      authRedirectPath,
      onSetAuthRedirectPath
    } = this.props;
    if (!buildingBurger && authRedirectPath !== '/') {
      onSetAuthRedirectPath();
    }
  }

  inputChangedHandler = (event, controlName) => {
    const { controls } = this.state;

    const updatedControls = updateObject(controls, {
      [controlName]: updateObject(controls[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          controls[controlName].validation
        ),
        touched: true
      })
    });

    this.setState({
      controls: updatedControls
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const { onAuth } = this.props;
    const {
      controls: { email, password },
      isSignUp
    } = this.state;
    onAuth(email.value, password.value, isSignUp);
  };

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return { isSignUp: !prevState.isSignUp };
    });
  };

  render() {
    const { controls, isSignUp } = this.state;
    const { loading, error, isAuthenticated, authRedirectPath } = this.props;

    let formElementArray = [];
    for (const key in controls) {
      formElementArray.push({
        id: key,
        config: controls[key]
      });
    }

    let form = formElementArray.map(formElement => {
      const {
        id,
        config: {
          elementType,
          elementConfig,
          value,
          valid,
          validation,
          touched
        }
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
    });

    if (loading) {
      form = <Spinner />;
    }
    let errorMessage = null;
    if (error) {
      switch (error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = (
            <p>The email address is already in use by another account.</p>
          );
          break;
        case 'INVALID_PASSWORD':
          errorMessage = (
            <p>The password is invalid or the user does not have a password.</p>
          );
          break;
        case 'OPERATION_NOT_ALLOWED':
          errorMessage = <p>Password sign-in is disabled for this project.</p>;
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMessage = (
            <p>
              We have blocked all requests from this device due to unusual
              activity. Try again later.
            </p>
          );
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = (
            <p>
              There is no user record corresponding to this identifier. The user
              may have been deleted.
            </p>
          );
          break;
        case 'USER_DISABLED':
          errorMessage = (
            <p>The user account has been disabled by an administrator.</p>
          );
          break;
        default:
          errorMessage = <p>{error.message}</p>;
          break;
      }
    }

    let authRedirect = null;
    if (isAuthenticated) {
      authRedirect = <Redirect to={authRedirectPath} />;
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType='Success'>SUBMIT</Button>
        </form>
        <Button clicked={this.switchAuthModeHandler} btnType='Danger'>
          SWITCH TO {isSignUp ? 'SIGN IN' : 'SIGN UP'}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.ingredients.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) =>
      dispatch(auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(setAuthRedirectPath('/'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);

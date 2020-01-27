import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    userId: userId
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('localId');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeOut = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    const apiKey = process.env.REACT_APP_API_KEY;
    let urlSignUp = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
    let urlSignIn = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const auhtData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let baseUrl = urlSignUp;
    if (!isSignUp) {
      baseUrl = urlSignIn;
    }
    dispatch(authStart());
    axios
      .post(baseUrl, auhtData)
      .then(response => {
        const { idToken, localId, expiresIn } = response.data;
        const expirationDate = new Date(
          new Date().getTime() + expiresIn * 1000
        );

        localStorage.setItem('token', idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('localId', localId);

        dispatch(authSuccess(idToken, localId));
        dispatch(checkAuthTimeOut(expiresIn));
      })
      .catch(error => {
        dispatch(authFail(error.response.data.error));
      });
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const auhtCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const localId = localStorage.getItem('localId');
        dispatch(authSuccess(token, localId, expirationDate));
        dispatch(
          checkAuthTimeOut(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

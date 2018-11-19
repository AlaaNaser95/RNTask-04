import axios from "axios";
import jwt_decode from "jwt-decode";

import * as actionTypes from "./types";
import { AsyncStorage } from "react-native";

const setAuthToken = token => {
  if (token) {
    AsyncStorage.setItem("token", token)
      .then(
        () => (axios.defaults.headers.common.Authorization = `jwt ${token}`)
      )
      .catch(err => console.log(err));
  } else {
    AsyncStorage.removeItem("token")
      .then(() => delete axios.defaults.headers.common.Authorization)
      .catch(err => console.log(err));
  }
};

export const setErrors = errors => ({
  type: actionTypes.SET_ERRORS,
  payload: errors
});

export const checkForExpiredToken = () => {
  return dispatch => {
    AsyncStorage.getItem("token")
      .then(token => {
        const currentTime = Date.now() / 1000;
        const user = jwt_decode(token);
        if (user.exp >= currentTime) {
          setAuthToken(token);
          dispatch(setCurrentUser(user));
        } else {
          dispatch(logout());
        }
      })
      .catch(err => console.log(err));
  };
};

export const login = (userData, nav) => {
  return dispatch => {
    axios
      .post("http://coffee.q8fawazo.me/api/login/", userData)
      .then(res => res.data)
      .then(user => {
        const decodedUser = jwt_decode(user.token);
        setAuthToken(user.token);
        dispatch(setCurrentUser(decodedUser));
        nav.replace("CoffeeList");
      })
      .catch(err => {
        dispatch(setErrors(err.response.data));
      });
  };
};

export const signup = (userData, nav) => {
  return dispatch => {
    axios
      .post("http://coffee.q8fawazo.me/api/register/", userData)
      .then(res => res.data)
      .then(user => {
        dispatch(login(userData, nav));
      })
      .catch(err => dispatch(setErrors(err.response.data)));
  };
};

export const logout = () => {
  setAuthToken();
  return setCurrentUser();
};

const setCurrentUser = user => ({
  type: actionTypes.SET_CURRENT_USER,
  payload: user
});

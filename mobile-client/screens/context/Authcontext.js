import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext({
  state: { isLoggedIn: false, user: null, error: null },
});

// Action Types
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';

const IP_ADDRESS = 'http://192.168.32.15:8081'; // Replace with your own IP address

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        isLoggedIn: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

const saveAuthDataToCache = async (data) => {
  try {
    await AsyncStorage.setItem('authData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to cache', error);
  }
};

const getAuthDataFromCache = async () => {
  try {
    const data = await AsyncStorage.getItem('authData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving data from cache', error);
  }
};

const clearAuthDataFromCache = async () => {
  try {
    await AsyncStorage.removeItem('authData');
  } catch (error) {
    console.error('Error clearing auth data from cache', error);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: false,
    user: null,
    error: null,
  });

  useEffect(() => {
    const loadAuthData = async () => {
      const cachedData = await getAuthDataFromCache();
      if (cachedData) {
        dispatch({ type: LOGIN_SUCCESS, payload: cachedData });
      }
    };

    loadAuthData();
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await axios.post(`${IP_ADDRESS}/api/auth/signin`, { email, password });


      const data = response.data;
      
      if (response.status === 200) {
        await saveAuthDataToCache(data);
        dispatch({ type: LOGIN_SUCCESS, payload: data });
        return data;
      } else {
        dispatch({ type: LOGIN_ERROR, payload: data.message || 'Failed to sign in' });
        throw new Error(data.message || 'Failed to sign in');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during sign in';
      dispatch({ type: LOGIN_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      await clearAuthDataFromCache(); // This function should remove auth data from AsyncStorage
      dispatch({ type: LOGOUT });
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  

  const storeUserData = () => {
    // Implement this function to store user data

  };

  const values = { state, dispatch, signIn, signOut, storeUserData };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

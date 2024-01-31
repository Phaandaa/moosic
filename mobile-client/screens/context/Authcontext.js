import React, { createContext, useContext, useReducer, useEffect } from 'react';

// AuthContext.js
const AuthContext = createContext({
    state: { isLoggedIn: false, user: null, error: null },
    signIn: async () => {},
    signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Action Types
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';

const authReducer = (state, action) => {
  // ... same as before
};

const saveAuthDataToCache = (data) => {
  // Assuming using AsyncStorage or similar
  localStorage.setItem('authData', JSON.stringify(data));
};

const getAuthDataFromCache = () => {
  // Assuming using AsyncStorage or similar
  const data = localStorage.getItem('authData');
  return data ? JSON.parse(data) : null;
};

const clearAuthDataFromCache = () => {
  localStorage.removeItem('authData');
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: false,
    user: null,
    error: null,
  });

  useEffect(() => {
    // On mount, check if auth data is cached and update state
    const cachedData = getAuthDataFromCache();
    if (cachedData) {
      dispatch({ type: LOGIN_SUCCESS, payload: cachedData });
    }
  }, []);

  const signIn = async (email, password) => {
    // ... same as before
    if (response.ok) {
      saveAuthDataToCache(data);
      dispatch({ type: LOGIN_SUCCESS, payload: data });
    } else {
      dispatch({ type: LOGIN_ERROR, payload: data.message || 'Failed to sign in' });
    }
  };

  const signOut = () => {
    clearAuthDataFromCache();
    dispatch({ type: LOGOUT });
  };

  const signUp = () =>{
    // Implement sign up logic here

  }

  // Pass down signIn and signOut along with the state and dispatch through the context
  return (
    <AuthContext.Provider value={{ state, dispatch, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );

};

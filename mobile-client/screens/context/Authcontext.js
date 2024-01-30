import React, { createContext, useContext, useReducer } from 'react';

// AuthContext.js
const AuthContext = createContext({
    state: { isLoggedIn: false, user: null, error: null },
    signIn: async () => {}, // Provide a default no-op function
    
  });
  

export const useAuth = () => useContext(AuthContext);

// Action Types
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';

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

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: false,
    user: null,
    error: null,
  });

  const signIn = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        dispatch({ type: LOGIN_SUCCESS, payload: data });
      } else {
        dispatch({ type: LOGIN_ERROR, payload: data.message || 'Failed to sign in' });
      }
    } catch (error) {
      dispatch({ type: LOGIN_ERROR, payload: error.message || 'An error occurred during sign in' });
    }
  };

  // Log out function if needed
  const signOut = () => {
    // Implement sign out logic here, possibly clearing tokens
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

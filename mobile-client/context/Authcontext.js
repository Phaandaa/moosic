import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IP_ADDRESS from '../constants/ip_address_temp';


const AuthContext = createContext({
  state: { isLoggedIn: false, userData: null, error: null, authHeader: null },
});

// Action Types
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, isLoggedIn: true, userData: action.payload.userData, authHeader: action.payload.authHeader };
    case LOGIN_ERROR:
      return { ...state, isLoggedIn: false, error: action.payload };
    case LOGOUT:
      return { ...state, isLoggedIn: false, userData: null, authHeader: null };
    default:
      return state;
  }
};

const saveAuthDataToCache = async (data) => {
  try {
    await AsyncStorage.setItem('authData', JSON.stringify(data));
  } catch (error) {
    console.error('Authcontext.js line 38, Error saving data to cache', error);
  }
};

const getAuthDataFromCache = async () => {
  try {
    const data = await AsyncStorage.getItem('authData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Authcontext.js line 43, Error retrieving auth data from cache', error);
  }
};

const clearAuthDataFromCache = async () => {
  try {
    await AsyncStorage.removeItem('authData');
  } catch (error) {
    console.error('Authcontext.js line 51, Error clearing auth data from cache', error);
  }
};

const loggingInAndRetrieveUserData = async (authData, dispatch) => {
  try {
    const userRolePath = authData.role === 'Teacher' ? 'teachers' : 'students';
    const authHeader = { headers: { Authorization: `Bearer ${authData.idToken}` } };
    console.log('AuthContext.js line 58, Auth header:', authHeader)

    const userDetailsResponse = await axios.get(`${IP_ADDRESS}/${userRolePath}/${authData.userId}`, authHeader);
    console.log('AuthContext.js line 61, User Details Response:', userDetailsResponse);

    if (userDetailsResponse.status === 200) {
      console.log("Authcontext.js line 64, userDetailsResponse.data: ", userDetailsResponse.data); 
      dispatch({ type: LOGIN_SUCCESS, payload: { userData:userDetailsResponse.data, authHeader } });
    } else {
      console.error('Authcontext.js line 67, Failed to fetch user details');
    }
  } catch (error) {
    console.error('Authcontext.js line 70, Error logging in and retrieving user data', error);
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: false,
    userData: null,
    error: null,
    authHeader: null,
  });

  useEffect(() => {
    const loadAuthData = async () => {
      var cachedAuthData = await getAuthDataFromCache();
      if (cachedAuthData) {
        const refreshTokenResponse = await axios.post(`${IP_ADDRESS}/api/auth/request-new-token/${cachedAuthData.userId}?refreshToken=${cachedData.refreshToken}`, {});
        const newRefreshToken = refreshTokenResponse.data.refresh_token
        const newIdToken = refreshTokenResponse.data.id_token;
        cachedAuthData = {...cachedAuthData, idToken: newIdToken, refreshToken: newRefreshToken}
        await saveAuthDataToCache(cachedAuthData);
        loggingInAndRetrieveUserData(cachedAuthData, dispatch);
      }
    };
    loadAuthData();
  }, []);


  const signIn = async (email, password, expoPushToken) => {
    try {
        console.log("Authcontext.js line 75: Here lies the expo push token ", expoPushToken);
        const response = await axios.post(`${IP_ADDRESS}/api/auth/signin`, { email, password, expoPushToken });
        const { data } = response;
        console.log("Authcontext.js line 78, to be savedAuthData:", data);
        if (response.status === 200 && data.userId) {
            await saveAuthDataToCache(data);
            loggingInAndRetrieveUserData(data, dispatch);
        } else {
            const errorMessage = data.message || 'Failed to sign in';
            dispatch({ type: LOGIN_ERROR, payload: errorMessage });
            throw new Error(errorMessage);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred during sign in';
        dispatch({ type: LOGIN_ERROR, payload: errorMessage });
        throw new Error(errorMessage);
    }
};


  // const signOut = async (userId, expoPushToken) => {
  //   try {
  //     const encodedExpoPushToken = encodeURIComponent(expoPushToken);
  //     const url = `${IP_ADDRESS}/api/auth/signout/${userId}?expoPushToken=${encodedExpoPushToken}`;
  //     console.log('Authcontext.js line 169, url: ', url);
  //     const response = await axios.post(url, {});
  //     await clearAuthDataFromCache(); // This function should remove auth data from AsyncStorage
  //     dispatch({ type: LOGOUT });
      
  //   } catch (error) {
  //     if (error.response) {
  //       console.error('Authcontext.js line 176, Error during sign out:', error.response.data);
  //     } else {
  //       console.error('Authcontext.js line 178, Error during sign out:', error.message);
  //     }
  //   }
  // };

  const signOut = async () => {
    try {
      await clearAuthDataFromCache(); // This function should remove auth data from AsyncStorage
      dispatch({ type: LOGOUT });
      
    } catch (error) {
      console.error('Authcontext.js line 189, Error during sign out:', error);
    }
  };

  const values = { state, dispatch, signIn, signOut };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

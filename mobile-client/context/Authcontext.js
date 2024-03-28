import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IP_ADDRESS from '../constants/ip_address_temp';


const AuthContext = createContext({
  state: { isLoggedIn: false, user: null, error: null, role: null },
});

// Action Types
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';
const STORE_USER_DATA = 'STORE_USER_DATA';



const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, isLoggedIn: true, user: action.payload, role: action.payload.role };
    case LOGIN_ERROR:
      return { ...state, isLoggedIn: false, error: action.payload };
    case LOGOUT:
      return { ...state, isLoggedIn: false, user: null, userData: null, role: null };
    case STORE_USER_DATA:
      return { ...state, userData: action.payload };
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

const saveUserCache = async (data) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    AsyncStorage.getItem('userData').then(data => {
      console.log('Authcontext.js line 46, userData from cache:', data);
    }).catch(err => {
      console.error('Authcontext.js line 48, Error reading userData from cache:', err);
    });
    
  } catch (error) {
    console.error('Authcontext.js line 52, Error saving data to cache', error);
  }
};
const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    dispatch({ type: STORE_USER_DATA, payload: userData });
    console.log('Authcontext.js line 59, state:', state);
  } catch (error) {
    console.error('Authcontext.js line 61, Error storing user data:', error);
  }
};

const getAuthDataFromCache = async () => {
  try {
    const data = await AsyncStorage.getItem('authData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Authcontext.js line 70, Error retrieving data from cache', error);
  }
};

const getUserDataFromCache = async () => {
  try {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Authcontext.js line 79, Error retrieving data from cache', error);
  }
};

const clearAuthDataFromCache = async () => {
  try {
    await AsyncStorage.removeItem('authData');
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    console.error('Authcontext.js line 88, Error clearing auth data from cache', error);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: false,
    user: null,
    error: null,
    role: null,
  });

  useEffect(() => {
    const loadAuthData = async () => {
      const cachedData = await getAuthDataFromCache();
      if (cachedData) {
        dispatch({ type: LOGIN_SUCCESS, payload: { user: cachedData.user, role: cachedData.role } });
      }
      
    };

    const loadCachedUserData = async () => {
      try {
        const cachedData = await getUserDataFromCache(); // Correct variable used
        if (cachedData) { // Check the correct variable
          dispatch({ type: STORE_USER_DATA, payload: cachedData }); // Directly use parsed data
        }
      } catch (error) {
        console.error('Authcontext.js line 116, Error retrieving user data from cache', error);
      }
    };
    

    loadAuthData();
    loadCachedUserData();
  }, []);


  const signIn = async (email, password, expoPushToken) => {
    try {
        console.log("Authcontext.js line 128: Here lies the expo push token ", expoPushToken);
        const response = await axios.post(`${IP_ADDRESS}/api/auth/signin`, { email, password, expoPushToken });
        const { data } = response;
        
        if (response.status === 200 && data.userId) {
            await saveAuthDataToCache(data);
            
            const userRolePath = data.role === 'Teacher' ? 'teachers' : 'students';

            const authHeader = { headers: { Authorization: `Bearer ${data.idToken}` } };
            console.log('AuthContext.js line 138, Auth header:', authHeader)

            const userDetailsResponse = await axios.get(`${IP_ADDRESS}/${userRolePath}/${data.userId}`,authHeader);
            console.log('AuthContext.js line 141, User Details Response:', userDetailsResponse);

            if (userDetailsResponse.status === 200) {
                console.log("Authcontext.js line 144, userDetailsResponse.data: ", userDetailsResponse.data); 
                await saveUserCache(userDetailsResponse.data);
                dispatch({ type: LOGIN_SUCCESS, payload: { ...data, role: userDetailsResponse.data.role } });
                return data; 
            } else {
                console.error('Authcontext.js line 149, Failed to fetch user details');
            }
        } else {
            // Handle unsuccessful login or missing userId
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
  

  

  const values = { state, dispatch, signIn, signOut, storeUserData };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

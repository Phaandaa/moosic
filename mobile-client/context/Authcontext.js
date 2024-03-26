import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IP_ADDRESS from '../constants/ip_address_temp';


const AuthContext = createContext({
  state: { isLoggedIn: false, user: null, error: null },
});

// Action Types
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';
const STORE_USER_DATA = 'STORE_USER_DATA';



const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, isLoggedIn: true, user: action.payload };
    case LOGIN_ERROR:
      return { ...state, isLoggedIn: false, error: action.payload };
    case LOGOUT:
      return { ...state, isLoggedIn: false, user: null, userData: null };
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
    console.error('Error saving data to cache', error);
  }
};

const saveUserCache = async (data) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    AsyncStorage.getItem('userData').then(data => {
      console.log('UserData from cache:', data);
    }).catch(err => {
      console.error('Error reading userData from cache:', err);
    });
    
  } catch (error) {
    console.error('Error saving data to cache', error);
  }
};
const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    dispatch({ type: STORE_USER_DATA, payload: userData });
    
  } catch (error) {
    console.error('Error storing user data:', error);
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

const getUserDataFromCache = async () => {
  try {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving data from cache', error);
  }
};

const clearAuthDataFromCache = async () => {
  try {
    await AsyncStorage.removeItem('authData');
    await AsyncStorage.removeItem('userData');
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

    const loadCachedUserData = async () => {
      try {
        const cachedData = await getUserDataFromCache(); // Correct variable used
        if (cachedData) { // Check the correct variable
          dispatch({ type: STORE_USER_DATA, payload: cachedData }); // Directly use parsed data
        }
      } catch (error) {
        console.error('Error retrieving user data from cache', error);
      }
    };
    

    loadAuthData();
    loadCachedUserData();
  }, []);


  const signIn = async (email, password, expoPushToken) => {
    try {
        const response = await axios.post(`${IP_ADDRESS}/api/auth/signin`, { email, password, expoPushToken });
        const { data } = response;
        
        // console.log(data.userId, data.role); // Confirm these values are correctly logged
        // console.log(data.idToken);
        
        if (response.status === 200 && data.userId) {
            await saveAuthDataToCache(data);
            
            // Using a dynamic URL based on the role to simplify the fetch logic
            const userRolePath = data.role === 'Teacher' ? 'teachers' : 'students';

            const authHeader = { headers: { Authorization: `Bearer ${data.idToken}` } };
            console.log('Auth header:', authHeader)

            const userDetailsResponse = await axios.get(`${IP_ADDRESS}/${userRolePath}/${data.userId}`,authHeader);
            console.log('User Details Response:', userDetailsResponse);

            if (userDetailsResponse.status === 200) {
                console.log(userDetailsResponse.data); // Log the fetched user details
                await saveUserCache(userDetailsResponse.data);
                dispatch({ type: LOGIN_SUCCESS, payload: data });

                // console.log('User Data:', userDetailsResponse.data);
                return data; // Return or handle the successful login and data fetch
            } else {
                console.error('Failed to fetch user details');
                // Handle failure to fetch user details
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


  const signOut = async (userId, expoPushToken) => {
    try {
      const response = await axios.post(`${IP_ADDRESS}/api/auth/signout/vNOxOYWrIhc4bpnhKQY2hyCOnO22?expoPushToken=${expoPushToken}`, {});
      console.log(expoPushToken);
      await clearAuthDataFromCache(); // This function should remove auth data from AsyncStorage
      dispatch({ type: LOGOUT });
      
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  // const signOut = async () => {
  //   try {
  //     await clearAuthDataFromCache(); // This function should remove auth data from AsyncStorage
  //     dispatch({ type: LOGOUT });
      
  //   } catch (error) {
  //     console.error('Error during sign out:', error);
  //   }
  // };
  

  

  const values = { state, dispatch, signIn, signOut, storeUserData };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

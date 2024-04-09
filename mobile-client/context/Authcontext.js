import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IP_ADDRESS from '../constants/ip_address_temp';


const AuthContext = createContext({
  state: { isLoggedIn: false, userData: null, error: null, authHeader: null, notifications: null },
});

// Action Types
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';
const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
const UPDATE_NOTIFS = 'UPDATE_NOTIFS';
const UPDATE_RESOURCE_REPOSITORY = 'UPDATE_RESOURCE_REPOSITORY';
const UPDATE_INVENTORY = 'UPDATE_INVENTORY';

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, isLoggedIn: true, 
        userData: action.payload.userData, 
        authHeader: action.payload.authHeader, 
        notifications: action.payload.notifications,
        resources: action.payload.resources,
        inventory: action.payload.inventory
       };
    case LOGIN_ERROR:
      return { ...state, isLoggedIn: false, error: action.payload };
    case LOGOUT:
      return { ...state, isLoggedIn: false, userData: null, authHeader: null };
    case UPDATE_USER_DATA:
      return { ...state, userData: action.payload.userData }
    case UPDATE_NOTIFS:
      return { ...state, notifications: action.payload.notifications }
    case UPDATE_RESOURCE_REPOSITORY:
      return { ...state, resources: action.payload.resources }
    case UPDATE_INVENTORY:
      return { ...state, inventory: action.payload.inventory }
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

    const requests = [
      axios.get(`${IP_ADDRESS}/${userRolePath}/${authData.userId}`, authHeader),
      axios.get(`${IP_ADDRESS}/notifications/${authData.userId}`, authHeader),
    ];

    if (authData.role === 'Teacher') {
      requests.push(axios.get(`${IP_ADDRESS}/material-repository/teacher/${authData.userId}`, authHeader));
    }

    if (authData.role === 'Student') {
      requests.push(axios.get(`${IP_ADDRESS}/student-inventory/${authData.userId}`, authHeader));
    }

    const responses = await Promise.all(requests);

    const userDetailsResponse = responses[0];
    const notificationResponse = responses[1];
    const resourcesResponse = authData.role === 'Teacher' ? responses[2] : null;
    const inventoryResponse = authData.role === 'Student' ? responses[2] : null;


    if (userDetailsResponse.status === 200) {
      dispatch({ type: LOGIN_SUCCESS, payload: { 
        userData:userDetailsResponse.data, 
        authHeader, 
        notifications: notificationResponse.data,
        inventory: authData.role === 'Student' ? inventoryResponse.data : null,
        resources: authData.role === 'Teacher' ? resourcesResponse.data : null } 
      });
    } else {
      console.error('Authcontext.js line 70, Failed to fetch user details');
    }
  } catch (error) {
    console.error('Authcontext.js line 73, Error logging in and retrieving user data', error);
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: false,
    userData: null,
    error: null,
    authHeader: null,
    notifications: null,
    resources: null,
    inventory: null,
  });

  useEffect(() => {
    const loadAuthData = async () => {
      var cachedAuthData = await getAuthDataFromCache();
      if (cachedAuthData) {
        const refreshTokenResponse = await axios.post(`${IP_ADDRESS}/api/auth/request-new-token/${cachedAuthData.userId}?refreshToken=${cachedAuthData.refreshToken}`, {});
        const newRefreshToken = refreshTokenResponse.data.refresh_token
        const newIdToken = refreshTokenResponse.data.id_token;
        const authHeader = { headers: { Authorization: `Bearer ${newIdToken}` } };
        cachedAuthData = {...cachedAuthData, idToken: newIdToken, refreshToken: newRefreshToken, authHeader}
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
        console.log("Authcontext.js line 147, to be savedAuthData:", data);
        if (response.status === 200 && data.userId) {
            const authHeader = { headers: { Authorization: `Bearer ${response.data.idToken}` } };
            const dataWithAuthHeader = {...data, authHeader}
            await saveAuthDataToCache(dataWithAuthHeader);
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


  const signOut = async (userId, expoPushToken) => {
    try {
      const encodedExpoPushToken = encodeURIComponent(expoPushToken);
      const url = `${IP_ADDRESS}/api/auth/signout/${userId}?expoPushToken=${encodedExpoPushToken}`;
      console.log('Authcontext.js line 169, url: ', url);
      const response = await axios.post(url, {});
      await clearAuthDataFromCache();
      dispatch({ type: LOGOUT });
      
    } catch (error) {
      if (error.response) {
        console.error('Authcontext.js line 176, Error during sign out:', error.response.data);
      } else {
        console.error('Authcontext.js line 178, Error during sign out:', error.message);
      }
    }
  };

  // const signOut = async () => {
  //   try {
  //     await clearAuthDataFromCache(); // This function should remove auth data from AsyncStorage
  //     dispatch({ type: LOGOUT });
      
  //   } catch (error) {
  //     console.error('Authcontext.js line 189, Error during sign out:', error);
  //   }
  // };

  const values = { state, dispatch, signIn, signOut };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

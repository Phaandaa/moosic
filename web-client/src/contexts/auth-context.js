import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { postAsync } from "src/utils/utils";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
  SIGN_UP: "SIGN_UP",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_UP]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["authenticated", "user"]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter(); // Using useRouter hook for redirection
  const initialized = useRef(false);

  console.log("AuthContext state", state);
  console.log("AuthContext cookies", cookies);

  const checkTokenExpiration = () => {
    const currentTime = new Date().getTime();
    const expirationTime = cookies.expirationTime ? parseInt(cookies.expirationTime, 10) : 0;

    if (currentTime >= expirationTime) {
      signOut(); // Automatically log out the user
      router.push("/auth/login"); // Redirect user to login page
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkTokenExpiration();
      console.log("Checking token expiration...");
    }, 1000 * 60); // check every minute

    return () => clearInterval(intervalId);
  }, [cookies.expirationTime, state.isAuthenticated]);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    // Check if the user is authenticated by checking the cookie
    const isAuthenticated = cookies.authenticated;
    const user = cookies.user ? cookies.user : null;

    if (isAuthenticated && user) {
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cookies.authenticated, cookies.user]
  );

  const signIn = async (email, password) => {
    const body = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    try {
      const response = await postAsync(`api/auth/signin`, body);
      if (!response.ok) {
        // If the server response is not ok, throw an error with the response status
        console.error(`Error: ${response.status}`);
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json(); // Assuming the response body will be in JSON format

      const expiresInMilliseconds = data.expiresIn * 1000; // Convert expiresIn to milliseconds
      const expirationTime = new Date().getTime() + expiresInMilliseconds;
      setCookie("idToken", data.idToken, { path: "/" });
      setCookie("expirationTime", expirationTime, { path: "/" });
      setCookie("authenticated", "true", { path: "/" });
      setCookie("user", JSON.stringify({ ...data, expirationTime }), { path: "/" });

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: data || { email, ...data }, // Adjust according to what your API returns
      });
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error so it can be caught by the calling code
    }
  };

  const signUp = async (email, name, password) => {
    const body = {
      email: email,
      name: name,
      password: password,
      role: "Admin",
    };

    try {
      const response = await postAsync(`users/create`, body);
      if (!response.ok) {
        // If the server response is not ok, throw an error with the response status
        console.error(`Error: ${response.status}`);
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json(); // Assuming the response body will be in JSON format
      console.log("signUp response", data);

      const expiresInMilliseconds = data.expiresIn * 1000; // Convert expiresIn to milliseconds
      const expirationTime = new Date().getTime() + expiresInMilliseconds;
      setCookie("expirationTime", expirationTime, { path: "/" });

      setCookie("authenticated", "true", { path: "/" });
      setCookie("user", JSON.stringify({ ...data, expirationTime }), { path: "/" });
      setCookie("idToken", data.idToken, { path: "/" });

      dispatch({
        type: HANDLERS.SIGN_UP,
        payload: data || { email, ...data }, // Adjust according to what your API returns
      });
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error so it can be caught by the calling code
    }
  };

  const signOut = () => {
    removeCookie("authenticated", { path: "/" });
    removeCookie("user", { path: "/" });
    removeCookie("idToken", { path: "/" });
    removeCookie("expirationTime", { path: "/" });
    router.push("/auth/login"); // Redirect user to login page
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);

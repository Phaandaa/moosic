// store.js
import { configureStore, combineReducers } from 'redux';
import cacheReducer from './cacheReducer';

const rootReducer = combineReducers({
  cache: cacheReducer,
});

const store = configureStore(rootReducer);

export default store;

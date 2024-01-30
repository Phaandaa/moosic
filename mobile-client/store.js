// store.js
import { createStore, combineReducers } from 'redux';
import cacheReducer from './cacheReducer';

const rootReducer = combineReducers({
  cache: cacheReducer,
});

const store = createStore(rootReducer);

export default store;

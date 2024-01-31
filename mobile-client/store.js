import { configureStore } from '@reduxjs/toolkit';
import cacheReducer  from './cacheSlice';

const store = configureStore({
  reducer: {
    cache: cacheReducer,
  },
});

export default store;

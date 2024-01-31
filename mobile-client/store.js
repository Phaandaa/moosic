import { configureStore } from '@reduxjs/toolkit';
import reducer from './cacheSlice';

export const store = configureStore({
  reducer: {
    cache: cacheReducer,
  },
});

import { createSlice } from '@reduxjs/toolkit';

const cacheSlice = createSlice({
  name: 'cache',
  initialState: {},
  reducers: {
    setCache: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
    clearCache: () => ({}),
  },
});

export const { setCache, clearCache } = cacheSlice.actions;
export default cacheSlice.reducer;

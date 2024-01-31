
export const SET_CACHE = 'SET_CACHE';
export const CLEAR_CACHE = 'CLEAR_CACHE';

export const setCache = (key, value) => ({
  type: SET_CACHE,
  payload: { key, value },
});

export const clearCache = () => ({
  type: CLEAR_CACHE,
});

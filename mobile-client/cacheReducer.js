// cacheReducer.js
import { SET_CACHE, CLEAR_CACHE } from './cacheActions';

const initialState = {};

const cacheReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CACHE:
      return { ...state, [action.payload.key]: action.payload.value };
    case CLEAR_CACHE:
      return {};
    default:
      return state;
  }
};

export default cacheReducer;

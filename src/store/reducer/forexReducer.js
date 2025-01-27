import { GETFOREX, GETMETALS, GETOILS, GETSTOCKS } from "../actionType.js";

const initalState = {
  forex: [],
  metals: [],
  stocks: [],
  oils: [],
};

export const forexReducer = (state = initalState, action) => {
  switch (action.type) {
    case GETFOREX:
      return {
        ...state,
        forex: action.data,
      };
    case GETMETALS:
      return {
        ...state,
        metals: action.metalsData,
      };
    case GETOILS:
      return {
        ...state,
        oils: action.data,
      };
    case GETSTOCKS:
      return {
        ...state,
        stocks: action.data,
      };
    default:
      return state;
  }
};

import { GETFOREX, GETMETALS, GETOILS, GETSTOCKS } from "../actionType.js";

export const getForex = (data) => {
  return {
    type: GETFOREX,
    data,
  };
};

export const getMetals = (metalsData) => {
  return {
    type: GETMETALS,
    metalsData,
  };
};

export const getOils = (data) => {
  return {
    type: GETOILS,
    data,
  };
};

export const getStocks = (data) => {
  return {
    type: GETSTOCKS,
    data,
  };
};

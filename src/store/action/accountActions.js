import { HANDLE_ACCOUNT, HANDLE_SUBUSER } from "../actionType.js";

export const handleAccountType = (userData) => {
  return {
    type: HANDLE_ACCOUNT,
    userData,
  };
};

export const handleSubAccount = (userData) => {
  return {
    type: HANDLE_SUBUSER,
    userData,
  };
};

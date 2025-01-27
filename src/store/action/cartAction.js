import {
  HANDLE_USER,
  USER_LOGOUT,
  EMAIL,
  HANDLE_ADMIN,
  SUB_USER_LOGOUT,
} from "../actionType.js";

export const handleUser = (userData) => {
  return {
    type: HANDLE_USER,
    userData,
  };
};

export const handleAdmin = (adminData) => {
  return {
    type: HANDLE_ADMIN,
    adminData,
  };
};

export const handleEmail = (email) => {
  return {
    type: EMAIL,
    email,
  };
};

export const logout = () => {
  return {
    type: USER_LOGOUT,
  };
};

export const subUserLogout = () => {
  return {
    type: SUB_USER_LOGOUT,
  };
};

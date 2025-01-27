import {
  HANDLE_USER,
  USER_LOGOUT,
  EMAIL,
  HANDLE_ADMIN,
} from "../actionType.js";

const initState = {
  user: {},
  email: "",
  admin: {},
};

export const userReducer = (state = initState, action) => {
  switch (action.type) {
    case EMAIL:
      return {
        ...state,
        email: action.email,
      };
    case HANDLE_USER:
      return {
        ...state,
        user: action.userData,
      };

    case HANDLE_ADMIN:
      return {
        ...state,
        admin: action.adminData,
      };

    case USER_LOGOUT:
      return {
        ...state,
        user: {},
        admin: {},
      };
    default:
      return state;
  }
};

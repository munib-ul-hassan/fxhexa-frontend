import { HANDLE_SUBUSER, SUB_USER_LOGOUT } from "../actionType.js";

const initState = {
  subUser: {},
};

export const subUserReducer = (state = initState, action) => {
  switch (action.type) {
    case HANDLE_SUBUSER:
      return {
        ...state,
        subUser: action.userData,
      };

    case SUB_USER_LOGOUT:
      return {
        ...state,
        subUser: {},
      };

    default:
      return state;
  }
};

import { HANDLE_ACCOUNT } from "../actionType.js";

const initState = {
  account: "",
};

export const accountReducer = (state = initState, action) => {
  switch (action.type) {
    case HANDLE_ACCOUNT:
      return {
        ...state,
        account: action.userData,
      };

    default:
      return state;
  }
};

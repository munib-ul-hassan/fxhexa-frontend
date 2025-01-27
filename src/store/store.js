import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// local imp
import { userReducer } from "./reducer/userReducer";
import { accountReducer } from "./reducer/accountReducer";
import { subUserReducer } from "./reducer/subUserReducer";
import { forexReducer } from "./reducer/forexReducer";

// config
const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["userReducer", "subUserReducer", "forexReducer"],
};

//  root reducer
const rootReducer = combineReducers({
  userReducer: userReducer,
  accountReducer: accountReducer,
  subUserReducer: subUserReducer,
  forexReducer: forexReducer,
});

const persiReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persiReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);

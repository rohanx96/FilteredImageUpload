//@flow
import { appReducer } from "./../../app/AppReducer";
import { combineReducers } from "redux";
import { PersistReducer } from "./PersistReducer";
import { persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["persist"],
  debug: true
};

const AppReducer = combineReducers({
  app: appReducer,
  persist: PersistReducer,
});

const RootReducer = (state, action) => {
  if (action.type === "CLEAR_STATE") {
    state = {
      app: { ...state.app }
    };
  }
  return AppReducer(state, action);
};

export default persistReducer(persistConfig, RootReducer);

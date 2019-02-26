import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { appReducer } from "../../app/AppReducer";
import { takePictureReducer } from "../../takePicture/TakePictureReducer";
import persistDataReducer from "./PersistReducer";
import signInReducer from "../../login/SignInReducer";

const persistConfig = {
  storage,
  key: "root",
  whitelist: ["persist"],
  debug: true
};

const AppReducer = combineReducers({
  app: appReducer,
  takePicture: takePictureReducer,
  persist: persistDataReducer,
  signIn: signInReducer
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

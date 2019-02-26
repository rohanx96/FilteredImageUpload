import { ACTION_TYPES } from "./SignInActions";
import createReducer from "../common/CreateReducer";

const initState = {
  customers: []
};

const takePictureReducer = createReducer(initState, {
  [ACTION_TYPES.setCustomers](state, action) {
    return Object.assign({}, state, {
      customers: action.payload
    });
  }
});

export default takePictureReducer;

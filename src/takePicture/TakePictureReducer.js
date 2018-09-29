//@flow
import { ACTION_TYPE } from "./TakePictureAction";
import createReducer from "./../common/CreateReducer";

const initState = {
  hubs : [],
  dealers : []
};
export const takePictureReducer = createReducer(initState, {
  [ACTION_TYPE.setHubs](state, action) {
    return Object.assign({}, state, {
      hubs : action.payload
    });
  },
  [ACTION_TYPE.setDealers](state, action) {
    return Object.assign({}, state, {
      dealers : action.payload
    });
  }
});

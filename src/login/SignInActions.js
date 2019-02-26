import firebase from "react-native-firebase";
import { showMessage } from "react-native-flash-message";
import { openBottomSheet, closeBottomSheet } from "../app/AppAction";
import { loaderDialog } from "../common/BottomDialogs";

export const ACTION_TYPES = {
  setCustomers: "SET_CUSTOMERS"
};

export const setCustomers = data => ({
  type: ACTION_TYPES.setCustomers,
  payload: data
});

export const getCustomers = () => {
  return function dispatchGetCustomers(dispatch) {
    dispatch(
      openBottomSheet(() => {
        return loaderDialog("Fetching data. Please Wait", undefined);
      }, false)
    );
    firebase
      .database()
      .ref("customers")
      .once(
        "value",
        snapshot => {
          let customers = [];
          console.log(snapshot);
          customers = snapshot._value.slice();
          dispatch(setCustomers(customers));
          dispatch(closeBottomSheet());
        },
        err => {
          dispatch(closeBottomSheet());
          showMessage({
            description:
              "Please make sure you are connected to the internet and try again.",
            message: "Failed to fetch data",
            type: "danger"
          });
          console.log(err);
        }
      );
  };
};

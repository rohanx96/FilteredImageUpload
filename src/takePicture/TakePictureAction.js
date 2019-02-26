import firebase from "react-native-firebase";
import { showMessage } from "react-native-flash-message";
import { openBottomSheet, closeBottomSheet } from "../app/AppAction";
import { loaderDialog } from "../common/BottomDialogs";

export const ACTION_TYPE = {
  setHubs: "SET_HUBS",
  setDealers: "SET_DEALERS"
};

export function setHubs(hubs) {
  return {
    type: ACTION_TYPE.setHubs,
    payload: hubs
  };
}

export function setDealers(dealers) {
  return {
    type: ACTION_TYPE.setDealers,
    payload: dealers
  };
}

export function getDealers(customer, hub) {
  return function dispatchGetDealers(dispatch) {
    dispatch(
      openBottomSheet(() => {
        return loaderDialog("Fetching data. Please Wait", undefined);
      }, false)
    );
    firebase
      .database()
      .ref("allData")
      .orderByChild("CUSTOMER_HUB")
      .equalTo(customer + hub)
      .once(
        "value",
        snapshot => {
          dispatch(closeBottomSheet());
          const dealers = [];
          console.log(snapshot);
          snapshot.forEach(data => {
            if (dealers.indexOf(data.val().DEALER) === -1) {
              dealers.push(data.val().DEALER);
            }
          });
          dealers.sort();
          dispatch(setDealers(dealers));
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
}

export function getHubs(customer) {
  return function dispatchGetHubs(dispatch, state) {
    dispatch(
      openBottomSheet(() => {
        return loaderDialog("Fetching data. Please Wait", undefined);
      }, false)
    );
    firebase
      .database()
      .ref("allData")
      .orderByChild("CUSTOMER")
      .equalTo(customer)
      .once(
        "value",
        snapshot => {
          const hubs = [];
          console.log(snapshot);
          snapshot.forEach(data => {
            if (hubs.indexOf(data.val().HUB) === -1) {
              hubs.push(data.val().HUB);
            }
          });
          hubs.sort();
          dispatch(setHubs(hubs));
          console.log(state().persist.selectedPrimaryFilter);
          dispatch(closeBottomSheet());
          if (state().persist.selectedPrimaryFilter) {
            dispatch(
              getDealers(customer, state().persist.selectedPrimaryFilter)
            );
          }
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
}

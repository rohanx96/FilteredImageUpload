import firebase from "react-native-firebase";

export function getDataFromFirebase() {
  firebase
    .database()
    .ref("hubs")
    .once(
      "value",
      snapshot => {
        console.log(snapshot);
      },
      err => {
          console.log(err)
      }
    );
  firebase
    .database()
    .ref("allData")
    .orderByChild("HUB")
    .equalTo("MADISON,IL")
    .once(
      "value",
      snapshot => {
        console.log(snapshot);
      },
      err => {
        console.log(err)
      }
    );
}

// @flow
import AppContainer from "./src/app/AppContainer";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { store } from "./src/common/Store";
import { data } from "./customer_data";

export default class App extends Component<{}, {}> {
  constructor(props) {
    super();
    console.disableYellowBox = true;
  }

  componentWillMount() {}

  componentDidMount() {
    // let database = {};
    // let allData = {};
    // let customers = [];
    // let hubs = [];
    // let customerHubs = [];
    // data.forEach(object => {
    //   let id = this.makeId();
    //   allData[id] = object;
    //   allData[id].CUSTOMER_HUB = object.CUSTOMER + object.HUB;
    //   if (customers.indexOf(object.CUSTOMER) == -1) {
    //     customers.push(object.CUSTOMER);
    //   }
    //   if (hubs.indexOf(object.HUB) == -1) {
    //     hubs.push(object.HUB);
    //   }
    // });
    // database = {
    //   allData,
    //   customers,
    //   hubs
    // };
    // console.log(JSON.stringify(database));
  }

  makeId() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 9; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

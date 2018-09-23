// @flow
import AppContainer from "./src/app/AppContainer";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { store } from "./src/common/Store";

export default class App extends Component<{}, {}> {
  constructor(props) {
    super();
    console.disableYellowBox = true;
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

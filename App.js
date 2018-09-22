/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Picker,
  TouchableHighlight
} from "react-native";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

type Props = {};
type State = {};
let defaultState = {
  selectedPrimaryFilter: undefined,
  selectedSecondaryFilter: undefined
};

let primaryFilter = [
  "Select primary filter",
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth"
];

let secondaryFilter = ["SecFirst", "SecSecond", "SecThird"];
export default class App extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.camera} />
        <View style={{ flex: 0.25 }}>
          <View style={{ flexDirection: "row", backgroundColor: "#ddd" }}>
            <Picker
              style={styles.picker}
              selectedValue={this.state.selectedPrimaryFilter}
              mode="dropdown"
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedPrimaryFilter: itemValue })
              }
            >
              {primaryFilter.map((data, index) => (
                <Picker.Item label={data} value={data} />
              ))}
            </Picker>
            <Picker
              style={styles.picker}
              mode="dropdown"
              selectedValue={this.state.selectedSecondaryFilter}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedSecondaryFilter: itemValue })
              }
              enabled={this.state.selectedPrimaryFilter ? true : false}
            >
              {secondaryFilter.map((data, index) => (
                <Picker.Item label={data} value={data} />
              ))}
            </Picker>
          </View>
          <View
            style={{ flex: 1, flexDirection: "row", alignItems: "stretch" }}
          >
            <TouchableHighlight
              style={{
                backgroundColor: "#018786",
                padding: 12,
                flex: 0.55,
                justifyContent: "center"
              }}
              onPress={() => {}}
            >
              <Text
                style={{ color: "#fff", fontSize: 24, textAlign: "center" }}
              >
                {"TAKE & \nSEND"}
              </Text>
            </TouchableHighlight>
            <View style={{ flexDirection: "column", flex: 0.45 }}>
              <TouchableHighlight
                style={{
                  backgroundColor: "#666",
                  padding: 12,
                  flex: 1,
                  justifyContent: "center"
                }}
                onPress={() => {}}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, textAlign: "center" }}
                >
                  {"CLEAR"}
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  backgroundColor: "#f50057",
                  padding: 12,
                  flex: 1,
                  justifyContent: "center"
                }}
                onPress={() => {}}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, textAlign: "center" }}
                >
                  {"EXIT"}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  camera: {
    flex: 0.75,
    backgroundColor: "#000"
  },
  picker: {
    flex: 0.5
  },
  pickerItem: {
    paddingLeft: 16
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

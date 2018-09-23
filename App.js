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
  Modal,
  Picker,
  ActivityIndicator,
  TouchableHighlight
} from "react-native";
import { RNCamera } from "react-native-camera";
import firebase from "react-native-firebase";
import moment from "moment";
import FlashMessage, {
  showMessage,
  hideMessage
} from "react-native-flash-message";

type Props = {};
type State = {};
let defaultState = {
  selectedPrimaryFilter: undefined,
  selectedSecondaryFilter: undefined,
  showModal: false
};

let primaryFilter = ["First", "Second", "Third", "Fourth", "Fifth"];

let secondaryFilter = ["SecFirst", "SecSecond", "SecThird"];
export default class App extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.onClickPicture = this.onClickPicture.bind(this);
    this.createFileName = this.createFileName.bind(this);
  }

  componentDidMount() {}

  onClickPicture() {
    if (
      this.state.selectedPrimaryFilter &&
      this.state.selectedSecondaryFilter
    ) {
      this.setState({
        showModal: true
      });
      const options = {
        width: 1024
      };
      if (this.camera.getStatus() == "READY") {
        this.camera
          .takePictureAsync(options)
          .then(data => {
            this.camera.pausePreview();
            console.log(data);
            firebase
              .storage()
              .ref(this.state.selectedPrimaryFilter)
              .child(this.state.selectedSecondaryFilter)
              .child(this.createFileName())
              .putFile(data.uri)
              .then(success => {
                console.log(success);
                this.setState({
                  selectedSecondaryFilter: undefined,
                  showModal: false
                });
                this.camera.resumePreview();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log("Camera not ready");
        showMessage({
          description:
            "Please make sure you have granted camera permission to Lanter Assurance",
          message: "Could not connect to camera",
          type: "danger"
        });
      }
    } else {
      showMessage({
        description: "Please select appropriate filters first.",
        message: "Set Filters",
        type: "danger"
      });
    }
  }

  createFileName() {
    return (
      this.state.selectedPrimaryFilter +
      "_" +
      this.state.selectedSecondaryFilter +
      "_" +
      moment().format()
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.camera}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.auto}
            permissionDialogTitle={"Permission to use camera"}
            permissionDialogMessage={
              "We need your permission to use your camera phone"
            }
          />
        </View>
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
              <Picker.Item
                key={"filler"}
                label={"-- Select Filter --"}
                value={undefined}
              />
              {primaryFilter.map((data, index) => (
                <Picker.Item key={data} label={data} value={data} />
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
              <Picker.Item
                key={"filler"}
                label={"-- Select Filter --"}
                value={undefined}
              />
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
                onPress={this.onClickPicture}
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => {
            console.log("Visible");
          }}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 22,
              borderRadius: 12,
              justifyContent: "flex-end",
              backgroundColor: "#33333333"
            }}
          >
            <View style={{ backgroundColor: "#fff", padding: 24 }}>
              <Text style={{ fontSize: 18 }}>Please Wait..</Text>
              <ActivityIndicator />
              <TouchableHighlight
                style={{
                  backgroundColor: "#f50057",
                  marginVertical: 12,
                  padding: 12
                }}
                onPress={() => {
                  this.setState({
                    showModal: false
                  });
                }}
              >
                <Text style={{ textAlign: "center", color: "#fff" }}>
                  Cancel
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <FlashMessage position="bottom" />
      </View>
    );
  }

  componentWillUnmount() {
    // Remove the alert located on this master page from the manager
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
  }
});

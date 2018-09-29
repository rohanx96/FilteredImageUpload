/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Picker,
  TouchableHighlight,
  Image,
  BackHandler,
  PermissionsAndroid
} from "react-native";
import { RNCamera } from "react-native-camera";
import firebase from "react-native-firebase";
import moment from "moment";
import { showMessage, hideMessage } from "react-native-flash-message";
import { loaderDialog, actionDialog } from "./../common/BottomDialogs";
import { requestPermissions } from "./../common/Permissions";

type Props = {};
type State = {};

let defaultState = {
  selectedPrimaryFilter: undefined,
  selectedSecondaryFilter: undefined,
  pictureData: undefined,
  hasPermissions: false
};
export default class App extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.state.selectedPrimaryFilter = this.props.selectedPrimaryFilter;
    this.customer = "HYU";
    this.onClickPicture = this.onClickPicture.bind(this);
    this.createFileName = this.createFileName.bind(this);
    this.requestCameraPermissions = this.requestCameraPermissions.bind(this);
    this.onClear = this.onClear.bind(this);
    primaryFilter = this.props.hubs;
  }

  componentDidMount() {
    this.requestCameraPermissions();
    this.props.getHubs(this.customer);
  }

  requestCameraPermissions() {
    requestPermissions(
      [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ],
      () => {
        this.setState({
          hasPermissions: true
        });
      },
      () => {
        console.log("Denied permissions");
        this.props.openBottomSheet(() => {
          return actionDialog(
            "Grant Permissions",
            "Please grant the required permissions to continue",
            () => {
              this.props.closeBottomSheet();
              this.requestCameraPermissions();
            }
          );
        }, false);
      },
      () => {
        console.log("Denied forever");
        this.props.openBottomSheet(() => {
          return actionDialog(
            "Grant Permissions",
            "Please go to application settings and grant the required permissions to continue"
          );
        });
      }
    );
  }

  onClear() {
    if (this.state.pictureData) {
      if (this.camera) {
        this.camera.resumePreview();
      }
      this.setState({
        pictureData: undefined
      });
    } else if (this.state.selectedSecondaryFilter) {
      this.setState({
        selectedSecondaryFilter: undefined
      });
    } else if (this.state.selectedPrimaryFilter) {
      this.props.setPrimaryFilter(undefined)
      this.setState({
        selectedPrimaryFilter: undefined
      });
    }
  }

  onClickPicture() {
    if (!this.state.pictureData) {
      if (
        this.state.selectedPrimaryFilter &&
        this.state.selectedSecondaryFilter
      ) {
        const options = {
          width: 1024
        };
        if (this.camera && this.camera.getStatus() == "READY") {
          this.props.openBottomSheet(() => {
            return loaderDialog(
              "Processing. Please keep the camera stable.",
              undefined
            );
          }, false);
          this.camera
            .takePictureAsync(options)
            .then(data => {
              this.props.closeBottomSheet();
              this.camera.pausePreview();
              this.setState({
                pictureData: data
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
          description: "Please select a hub and corresponding dealer first.",
          message: "Set Filters",
          type: "danger"
        });
      }
    } else {
      let shouldCancel = false;
      this.props.openBottomSheet(() => {
        return loaderDialog("Uploading image. Please Wait", () => {
          shouldCancel = true;
          this.props.closeBottomSheet();
        });
      }, false);
      let fileName = this.createFileName();
      let hub = this.state.selectedPrimaryFilter;
      let dealer = this.state.selectedSecondaryFilter;
      firebase
        .storage()
        .ref(this.customer)
        .child(hub)
        .child(dealer)
        .child(fileName)
        .putFile(this.state.pictureData.uri)
        .then(success => {
          console.log(success);
          if (!shouldCancel) {
            this.props.closeBottomSheet();
            this.setState({
              selectedSecondaryFilter: undefined,
              pictureData: undefined
            });
          } else {
            firebase
              .storage()
              .ref(this.customer)
              .child(hub)
              .child(dealer)
              .child(fileName)
              .delete();
          }
          // if (this.camera) {
          //   this.camera.resumePreview();
          // }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  onExit() {
    BackHandler.exitApp();
  }

  createFileName() {
    return (
      this.customer +
      "_" +
      this.state.selectedPrimaryFilter +
      "_" +
      this.state.selectedSecondaryFilter +
      "_" +
      moment().format()
    );
  }

  render() {
    let buttonColor = this.state.pictureData ? "#FF9800" : "#018786";
    return (
      <View style={styles.container}>
        <View style={styles.camera}>
          {this.state.pictureData && (
            <Image
              source={{ uri: this.state.pictureData.uri }}
              resizeMode={"contain"}
              style={{ flex: 1 }}
            />
          )}
          {!this.state.pictureData &&
            this.state.hasPermissions && (
              <View style={{ flex: 1 }}>
                <RNCamera
                  ref={ref => {
                    this.camera = ref;
                  }}
                  style={{ flex: 1 }}
                  type={RNCamera.Constants.Type.back}
                  flashMode={RNCamera.Constants.FlashMode.off}
                />
              </View>
            )}
        </View>
        <View style={{ flex: 0.25 }}>
          <View style={{ flexDirection: "row", backgroundColor: "#ddd" }}>
            <Picker
              style={styles.picker}
              selectedValue={this.state.selectedPrimaryFilter}
              mode="dropdown"
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue) {
                  this.props.setPrimaryFilter(itemValue)
                  this.props.getDealers(this.customer, itemValue);
                }
                this.setState({
                  selectedPrimaryFilter: itemValue,
                  selectedSecondaryFilter: undefined,
                  pictureData: undefined
                });
              }}
            >
              <Picker.Item
                key={"filler"}
                label={"-- Select Hub --"}
                value={undefined}
              />
              {this.props.hubs.map((data, index) => (
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
                label={"-- Select Dealer --"}
                value={undefined}
              />
              {this.props.dealers.map((data, index) => (
                <Picker.Item label={data} value={data} />
              ))}
            </Picker>
          </View>
          <View
            style={{ flex: 1, flexDirection: "row", alignItems: "stretch" }}
          >
            <TouchableHighlight
              style={{
                backgroundColor: buttonColor,
                padding: 12,
                flex: 0.55,
                justifyContent: "center"
              }}
              onPress={this.onClickPicture}
            >
              <Text
                style={{ color: "#fff", fontSize: 24, textAlign: "center" }}
              >
                {this.state.pictureData ? "SEND \nPHOTO" : "TAKE \nPHOTO"}
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
                onPress={this.onClear}
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
                onPress={this.onExit}
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

  componentWillUnmount() {}
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

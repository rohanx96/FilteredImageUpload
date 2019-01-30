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
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  ActionSheetIOS
} from "react-native";
import { RNCamera } from "react-native-camera";
import firebase, { auth } from "react-native-firebase";
import moment from "moment";
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  loaderDialog,
  actionDialog,
  listDialog
} from "./../common/BottomDialogs";
import { requestPermissions } from "./../common/Permissions";
import ImageMarker from "react-native-image-marker";
import * as Animatable from "react-native-animatable";

type Props = {};
type State = {};

let defaultState = {
  selectedPrimaryFilter: undefined,
  selectedSecondaryFilter: undefined,
  pictureData: [],
  takePhoto: true,
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
    if (Platform.OS === "android") {
      this.requestCameraPermissions();
    }
    if (auth().currentUser) {
      this.props.getHubs(this.customer);
    } else {
      auth()
        .signInAnonymously()
        .then(data => {
          console.log("---SIGNED IN ---");
          this.props.getHubs(this.customer);
        })
        .catch(err => {
          showMessage({
            description:
              "Please make sure you are connected to the internet and try again.",
            message: "Failed to fetch data",
            type: "danger"
          });
        });
    }
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

  isPictureTaken = () => {
    return this.state.pictureData && this.state.pictureData.length > 0;
  };

  onClear() {
    if (this.isPictureTaken()) {
      if (this.camera) {
        this.camera.resumePreview();
      }
      this.setState({
        takePhoto: true,
        pictureData: []
      });
    } else if (this.state.selectedSecondaryFilter) {
      this.setState({
        selectedSecondaryFilter: undefined
      });
    } else if (this.state.selectedPrimaryFilter) {
      this.props.setPrimaryFilter(undefined);
      this.setState({
        selectedPrimaryFilter: undefined
      });
    }
  }

  onClickPicture() {
    if (
      this.state.selectedPrimaryFilter &&
      this.state.selectedSecondaryFilter
    ) {
      const options = {
        width: 1024,
        fixOrientation: true,
        forceUpOrientation: true
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
            this.camera.pausePreview();
            this.timestamp = moment().format();
            ImageMarker.markText({
              src: data.uri,
              text: this.createFileName(true),
              position: "topLeft",
              color: "#FF0000",
              fontSize: 44,
              scale: 1,
              quality: 100
            })
              .then(path => {
                console.log(path);
                this.props.closeBottomSheet();
                let pictureData = this.state.pictureData.slice();
                pictureData.push({
                  uri: Platform.OS === "android" ? "file://" + path : path,
                  timestamp: this.timestamp
                });
                this.setState({
                  takePhoto: false,
                  pictureData: pictureData
                });
                console.log(this.state.pictureData);
              })
              .catch(err => console.log(err));
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
  }

  onUploadImages = index => {
    let shouldCancel = false;
    let picture = this.state.pictureData[index];
    this.props.openBottomSheet(() => {
      return loaderDialog(
        `Uploading image ${index + 1} of ${
          this.state.pictureData.length
        }\nPlease Wait..`,
        () => {
          shouldCancel = true;
          this.props.closeBottomSheet();
        }
      );
    }, false);
    let fileName = this.createFileName(false, picture.timestamp);
    let hub = this.state.selectedPrimaryFilter;
    let dealer = this.state.selectedSecondaryFilter;
    console.log(picture);
    firebase
      .storage()
      .ref(this.customer)
      .child(hub)
      .child(dealer)
      .child(fileName)
      .putFile(picture.uri)
      .then(success => {
        console.log(success);
        if (!shouldCancel) {
          firebase
            .database()
            .ref("imageData")
            .push(
              {
                timestamp: picture.timestamp,
                customer: this.customer,
                hub: hub,
                dealer: dealer,
                download_url: success.downloadURL,
                metaData: {
                  contentType: success.metadata.contentType,
                  fullPath: success.metadata.fullPath,
                  size: success.metadata.size,
                  name: success.metadata.name,
                  md5Hash: success.metadata.md5Hash
                }
              },
              () => {
                if (index === this.state.pictureData.length - 1) {
                  this.props.closeBottomSheet();
                  this.setState({
                    selectedSecondaryFilter: undefined,
                    pictureData: []
                  });
                } else {
                  this.onUploadImages(index + 1);
                }
              }
            );
        } else {
          firebase
            .storage()
            .ref(this.customer)
            .child(hub)
            .child(dealer)
            .child(fileName)
            .delete()
            .then(data => {
              console.log(data);
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        shouldCancel = true;
        this.props.closeBottomSheet();
        showMessage({
          type: "danger",
          message: "Something went wrong. Please try again"
        });
        console.log(err);
      });
  };

  showUploadImageDialog = () => {
    this.props.openBottomSheet(() => {
      return listDialog(
        this.state.pictureData,
        ({ item }) => (
          <TouchableOpacity
            style={{
              marginRight: 12
            }}
            onPress={() => {
              this.props.navigation.navigate("ImageViewer", {
                file: item,
                onDelete: () => {
                  let index = this.state.pictureData.indexOf(item);
                  if (index !== -1) {
                    this.state.pictureData.splice(index, 1);
                    this.setState({
                      pictureData: this.state.pictureData.slice()
                    });
                    console.log(this.state);
                  }
                }
              });
              this.props.closeBottomSheet();
            }}
          >
            <Image
              style={{ height: 144, width: 128, borderRadius: 4 }}
              source={{
                uri: item.uri
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ),
        item => {
          return item.uri;
        },
        true,
        () => {
          this.onUploadImages(0);
        },
        () => {
          this.props.closeBottomSheet();
        }
      );
    }, false);
  };

  onExit() {
    BackHandler.exitApp();
  }

  createFileName(addLineBreaks, timestamp) {
    let fileName =
      this.customer +
      (addLineBreaks ? "\n" : "_") +
      this.state.selectedPrimaryFilter +
      (addLineBreaks ? "\n" : "_") +
      this.state.selectedSecondaryFilter +
      (addLineBreaks ? "\n" : "_") +
      (timestamp ? timestamp : this.timestamp);
    console.log(fileName);
    return fileName;
  }

  render() {
    return (
      <Animatable.View style={styles.container}>
        <View style={styles.camera}>
          {this.isPictureTaken() && !this.state.takePhoto && (
            <Image
              source={{
                uri: this.state.pictureData[this.state.pictureData.length - 1]
                  .uri
              }}
              resizeMode={"contain"}
              style={{ flex: 1 }}
            />
          )}
          {(!this.isPictureTaken() || this.state.takePhoto) &&
            (Platform.OS === "ios" || this.state.hasPermissions) && (
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
        {!this.isPictureTaken() || this.state.takePhoto ? (
          <Animatable.View
            animation="slideInLeft"
            useNativeDriver={true}
            style={{ flex: 0.25 }}
          >
            <View style={{ flexDirection: "row", backgroundColor: "#ddd" }}>
              {Platform.OS === "android" ? (
                <Picker
                  style={styles.picker}
                  selectedValue={this.state.selectedPrimaryFilter}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) => {
                    if (itemValue) {
                      this.props.setPrimaryFilter(itemValue);
                      this.props.getDealers(this.customer, itemValue);
                    }
                    this.setState({
                      selectedPrimaryFilter: itemValue,
                      selectedSecondaryFilter: undefined,
                      pictureData: []
                    });
                  }}
                  enabled={this.isPictureTaken() ? false : true}
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
              ) : (
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    flex: 1,
                    borderRightWidth: 1,
                    borderRightColor: "#333",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  onPress={() => {
                    let options = this.props.hubs.slice();
                    options.push("Cancel");
                    ActionSheetIOS.showActionSheetWithOptions(
                      {
                        options: options,
                        cancelButtonIndex: this.props.hubs.length,
                        title: "Select Hub"
                      },
                      buttonIndex => {
                        if (buttonIndex !== this.props.hubs.length) {
                          this.props.setPrimaryFilter(
                            this.props.hubs[buttonIndex]
                          );
                          this.props.getDealers(
                            this.customer,
                            this.props.hubs[buttonIndex]
                          );
                          this.setState({
                            selectedPrimaryFilter: this.props.hubs[buttonIndex],
                            selectedSecondaryFilter: undefined,
                            pictureData: []
                          });
                        }
                      }
                    );
                  }}
                  disabled={this.isPictureTaken() ? true : false}
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      color: this.isPictureTaken() ? "#888" : "#333",
                      textAlign: "center",
                      fontSize: 15
                    }}
                  >
                    {this.state.selectedPrimaryFilter
                      ? this.state.selectedPrimaryFilter
                      : "-- Select Hub --"}
                  </Text>
                </TouchableOpacity>
              )}
              {Platform.OS === "android" ? (
                <Picker
                  style={styles.picker}
                  mode="dropdown"
                  selectedValue={this.state.selectedSecondaryFilter}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ selectedSecondaryFilter: itemValue })
                  }
                  enabled={
                    this.isPictureTaken()
                      ? false
                      : this.state.selectedPrimaryFilter
                      ? true
                      : false
                  }
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
              ) : (
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  onPress={() => {
                    let options = this.props.dealers.slice();
                    options.push("Cancel");
                    ActionSheetIOS.showActionSheetWithOptions(
                      {
                        options: options,
                        cancelButtonIndex: this.props.dealers.length,
                        title: "Select Dealer"
                      },
                      buttonIndex => {
                        if (buttonIndex !== this.props.dealers.length) {
                          this.setState({
                            selectedSecondaryFilter: this.props.dealers[
                              buttonIndex
                            ]
                          });
                        }
                      }
                    );
                  }}
                  disabled={
                    !(this.isPictureTaken()
                      ? false
                      : this.state.selectedPrimaryFilter
                      ? true
                      : false)
                  }
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      color: !(this.isPictureTaken()
                        ? false
                        : this.state.selectedPrimaryFilter
                        ? true
                        : false)
                        ? "#888"
                        : "#333",
                      textAlign: "center",
                      fontSize: 15
                    }}
                  >
                    {this.state.selectedSecondaryFilter
                      ? this.state.selectedSecondaryFilter
                      : "-- Select Dealer --"}
                  </Text>
                </TouchableOpacity>
              )}
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
                onPress={this.onClickPicture}
              >
                <Text
                  style={{ color: "#fff", fontSize: 24, textAlign: "center" }}
                >
                  {"TAKE \nPHOTO"}
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
                {Platform.OS === "android" && (
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
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        textAlign: "center"
                      }}
                    >
                      {"EXIT"}
                    </Text>
                  </TouchableHighlight>
                )}
              </View>
            </View>
          </Animatable.View>
        ) : (
          <Animatable.View
            style={{ flex: 0.25 }}
            animation="slideInRight"
            useNativeDriver={true}
          >
            <View style={{ flexDirection: "row", flex: 0.75 }}>
              <TouchableHighlight
                style={{
                  backgroundColor: "#018786",
                  padding: 12,
                  flex: 1,
                  justifyContent: "center"
                }}
                onPress={() => {
                  this.setState({
                    takePhoto: true
                  });
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 24, textAlign: "center" }}
                >
                  {"TAKE MORE PHOTOS"}
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  backgroundColor: "#FF9800",
                  padding: 12,
                  flex: 1,
                  justifyContent: "center"
                }}
                onPress={() => {
                  this.showUploadImageDialog();
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 24, textAlign: "center" }}
                >
                  {"UPLOAD \nPHOTOS"}
                </Text>
              </TouchableHighlight>
            </View>
            <TouchableHighlight
              style={{
                backgroundColor: "#666",
                padding: 12,
                flex: 0.25,
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
          </Animatable.View>
        )}
      </Animatable.View>
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

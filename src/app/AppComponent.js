//@flow
import React, { Component } from "react";
import { Modal, View } from "react-native";
import FlashMessage from "react-native-flash-message";
import TakePicture from "./../takePicture/TakePicture";

const defaultState = {
  isInitialised: false
};

export default class AppComponent extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentDidMount() {
    console.log("mounting app component");
  }

  componentWillUnmount() {}

  render() {
    if (this.props.isRehydrated) {
      return (
        <View style={{ flex: 1 }}>
          <TakePicture />
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.isBSOpen}
            onRequestClose={() => {
              if (this.props.isBSBackClose) {
                this.props.closeBottomSheet();
              }
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
              {this.props.renderBottomsheet()}
            </View>
          </Modal>
          <FlashMessage position="bottom" />
        </View>
      );
    } else {
      return <View style={{ flex: 1 }} />;
    }
  }
}

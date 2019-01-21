import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity, View, Text } from "react-native";

export default class ImageViewer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let uri = undefined;
    console.log(this.props.navigation);
    if (this.props.navigation.getParam("isUri", true)) {
      uri = this.props.navigation.getParam("file").uri;
    } else {
      uri = this.props.navigation.state.params.file.FilePath;
    }
    console.log(uri);
    return (
      <View style={localStyles.containerStyle}>
        <Image
          style={[localStyles.imageStyle]}
          source={{ uri: uri }}
          resizeMode={"contain"}
        />

        <TouchableOpacity
          style={{
            width: "100%",
            height: 32,
            marginTop: 32,
            marginLeft: 32,
            paddingHorizontal: 32,
            justifyContent: "flex-end",
            position: "absolute"
          }}
          onPress={() => {
            this.props.navigation.goBack("");
          }}
        >
          <Image
            source={require("./../assets/ic_back_cross.png")}
            style={{
              width: 32,
              height: 32,
              alignSelf: "flex-end",
              tintColor: "#fff"
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={localStyles.buttonStyle}
          onPress={() => {
            this.props.navigation.state.params.onDelete();
            this.props.navigation.goBack("");
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>DELETE</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#000"
  },
  buttonStyle: {
    alignSelf: "stretch",
    justifyContent: "center",
    margin: 20,
    backgroundColor: "#FF9800",
    borderRadius: 12,
    padding: 12
  },
  imageStyle: {
    alignSelf: "stretch",
    flex: 1
  }
});

import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Picker,
  ActionSheetIOS,
  Platform,
  Image
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { showMessage } from "react-native-flash-message";
import { auth } from "react-native-firebase";

const logoTextImage = require("../assets/logo_text.png");

export default class SignInComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCustomer: undefined
    };
    if (props.selectedCustomer) {
      this.resetToHome();
    }
  }

  componentDidMount() {
    if (auth().currentUser) {
      this.props.getCustomers();
    } else {
      auth()
        .signInAnonymously()
        .then(data => {
          console.log("---SIGNED IN ---");
          this.props.getCustomers();
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

  resetToHome() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "TakePicture" })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={logoTextImage}
          style={{ width: "60%", height: "70%" }}
          resizeMode="contain"
        />
        {Platform.OS === "android" ? (
          <View
            style={{
              borderRadius: 24,
              width: "60%",
              alignItems: "center",
              backgroundColor: "#ddd",
              justifyContent: "center",
              overflow: "hidden"
            }}
          >
            <Picker
              style={{
                width: "80%",
                justifyContent: "center",
                alignItems: "center"
              }}
              selectedValue={this.state.selectedCustomer}
              mode="dropdown"
              onValueChange={itemValue => {
                if (itemValue) {
                  this.setState({
                    selectedCustomer: itemValue
                  });
                }
              }}
            >
              <Picker.Item
                key="filler"
                label="Select Customer"
                value={undefined}
              />
              {this.props.customers.map(data => (
                <Picker.Item key={data} label={data} value={data} />
              ))}
            </Picker>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 32,
              backgroundColor: "#ddd",
              borderRadius: 24,
              width: "60%",
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => {
              const options = this.props.customers.slice();
              options.push("Cancel");
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex: this.props.customers.length,
                  title: "Select Customer"
                },
                buttonIndex => {
                  if (buttonIndex !== this.props.customers.length) {
                    this.setState({
                      selectedCustomer: this.props.customers[buttonIndex]
                    });
                  }
                }
              );
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                textAlign: "center",
                fontSize: 15
              }}
            >
              {this.state.selectedCustomer
                ? this.state.selectedCustomer
                : "-- Select Customer --"}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 32,
            backgroundColor: "#173D6D",
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
            width: "60%"
          }}
          onPress={() => {
            if (this.state.selectedCustomer) {
              this.props.setCustomer(this.state.selectedCustomer);
              this.resetToHome();
            } else {
              showMessage({
                type: "danger",
                description: "Please select customer first",
                message: "Select Customer"
              });
            }
          }}
        >
          <Text style={{ color: "white" }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

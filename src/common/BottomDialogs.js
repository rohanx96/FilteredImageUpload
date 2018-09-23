//@flow

import React, { Component } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableHighlight,
  View
} from "react-native";

export function loaderDialog(header, onCancel) {
  return (
    <View style={{ backgroundColor: "#fff", padding: 24 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ fontSize: 18, paddingHorizontal: 12 }}>{header}</Text>
      </View>
      {onCancel && (
        <TouchableHighlight
          style={{
            backgroundColor: "#f50057",
            marginVertical: 12,
            padding: 12
          }}
          onPress={() => {
            onCancel();
          }}
        >
          <Text style={{ textAlign: "center", color: "#fff" }}>Cancel</Text>
        </TouchableHighlight>
      )}
    </View>
  );
}

export function actionDialog(header, description, onDone) {
  return (
    <View style={{ backgroundColor: "#fff", padding: 24 }}>
      <Text style={{ fontSize: 24 }}>{header}</Text>
      <Text style={{ fontSize: 16 }}>{description}</Text>
      {onDone && (
        <TouchableHighlight
          style={{
            backgroundColor: "#f50057",
            marginVertical: 12,
            padding: 12
          }}
          onPress={() => {
            onDone();
          }}
        >
          <Text style={{ textAlign: "center", color: "#fff" }}>Okay</Text>
        </TouchableHighlight>
      )}
    </View>
  );
}

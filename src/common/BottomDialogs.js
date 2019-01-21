//@flow

import React, { Component } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableHighlight,
  View,
  FlatList
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
            padding: 16,
            borderRadius: 24
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
            padding: 12,
            borderRadius: 24
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

export function listDialog(
  data,
  renderItem,
  keyExtractor,
  isHorizontal,
  onDone,
  onCancel
) {
  return (
    <View style={{ backgroundColor: "#fff", paddingVertical: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16, paddingHorizontal: 24 }}>
        {"Upload Images"}
      </Text>
      {/* <Text style={{ fontSize: 16 }}>{description}</Text> */}
      <FlatList
        contentContainerStyle={{
          paddingVertical: 12,
          paddingHorizontal: 24
        }}
        data={data}
        horizontal={isHorizontal}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      <View
        style={{ flexDirection: "row", marginTop: 16, paddingHorizontal: 24 }}
      >
        {onDone && (
          <TouchableHighlight
            style={{
              backgroundColor: "#FF9800",
              padding: 12,
              flex: 1,
              borderRadius: 24,
              marginRight: 12
            }}
            onPress={() => {
              onDone();
            }}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>UPLOAD</Text>
          </TouchableHighlight>
        )}
        {onCancel && (
          <TouchableHighlight
            style={{
              backgroundColor: "#f50057",
              padding: 12,
              borderRadius: 24,
              flex: 1
            }}
            onPress={() => {
              onCancel();
            }}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>CANCEL</Text>
          </TouchableHighlight>
        )}
      </View>
    </View>
  );
}

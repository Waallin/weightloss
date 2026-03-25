import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";

const SettingsScreen = () => {
  return (
    <View
      style={{
        ...globalStyles.container,
        backgroundColor: colors.ui.first,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ ...globalStyles.regularText, color: "white" }}>
        Settings
      </Text>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});

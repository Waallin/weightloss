import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { spacing } from "../constants/spacing";
import { colors } from "../constants/colors";
import { globalStyles } from "../constants/globalStyles";

const TopBar = ({ title }: { title: string }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: spacing.md,

        alignItems: "center",
        backgroundColor: colors.ui.lightBlueBackground,
      }}
    >
      <Text style={{ ...globalStyles.smallTitle }}>{title}</Text>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({});

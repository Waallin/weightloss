import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";

const ProgressBar = ({ progress }: { progress: number }) => {
  const returnColor = () => {
    if (progress === 1) {
      return colors.progressBar.oneHundred;
    } else if (progress >= 0.75) {
      return colors.progressBar.fifty;
    } else if (progress >= 0.5) {
      return colors.progressBar.twentyFive;
    }
    return colors.progressBar.zero;
  };
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: progress,
            height: 10,
            backgroundColor: returnColor(),
            borderRadius: spacing.borderRadius,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            right: 0,
            width: "100%",
            zIndex: -1,
            height: 10,
            backgroundColor: colors.ui.lightGrey,
            borderBottomRightRadius: spacing.borderRadius,
            borderTopRightRadius: spacing.borderRadius,
            borderBottomLeftRadius: spacing.borderRadius,
            borderTopLeftRadius: spacing.borderRadius,
          }}
        ></View>
      </View>
      <Text
        style={{
          fontSize: 12,
          color: colors.ui.darkBlue,
          marginTop: spacing.sm,
          textAlign: "right",
        }}
      >
        {progress * 100}% completed
      </Text>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({});

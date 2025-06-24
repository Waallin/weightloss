import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "../constants/globalStyles";
import { spacing } from "../constants/spacing";
import { Entypo } from "@expo/vector-icons";

const TagComponent = ({ item }: { item: any }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        backgroundColor: item.backgroundColor,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: spacing.borderRadius,
      }}
    >
      {item.icon}
      <Text
        style={{
          ...globalStyles.xSmallText,
          fontWeight: "bold",
          color: item.textColor,
          textTransform: "capitalize",
        }}
      >
        {item.type}
      </Text>
    </View>
  );
};

export default TagComponent;

const styles = StyleSheet.create({});

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { HistoryItemType } from "../types";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Entypo } from "@expo/vector-icons";
const HistoryItem = ({ item }: { item: HistoryItemType }) => {
  const returnColor = () => {
    switch (item.status) {
      case "docked":
        return colors.boatStatus.docked;
      case "sailing":
        return colors.boatStatus.sailing;
      case "anchor":
        return colors.boatStatus.anchor;
      default:
        return colors.boatStatus.unknown;
    }
  };
  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            ...globalStyles.smallText,
            fontWeight: "bold",
            color: "black",
          }}
        >
          {item.location}
        </Text>
        <View
          style={{
            backgroundColor: returnColor(),
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
            borderRadius: spacing.borderRadius,
          }}
        >
          <Text style={{ ...globalStyles.smallText, color: "white" }}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: spacing.sm }}>
        <Text style={{ ...globalStyles.xSmallText }}>
          2 hours ago * May 23, 2025
        </Text>
      </View>
      <View
        style={{
          marginTop: spacing.xs,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ ...globalStyles.xSmallText }}>1.24°N 103.82°Es</Text>
        <Entypo name="chevron-right" size={20} color={colors.ui.darkGrey} />
      </View>
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({});

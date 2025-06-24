import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { CostBreakdownType } from "../types";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { colors } from "../../../../constants/colors";

const CostBreakdownItem = ({ item }: { item: CostBreakdownType }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        backgroundColor: colors.ui.white,
        ...globalStyles.cardShadow,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
      }}
    >
      <View
        style={{
          backgroundColor: item.color,
          padding: spacing.md,
          borderRadius: spacing.borderRadius,
        }}
      ></View>
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          {item.title}
        </Text>
        <Text style={{ ...globalStyles.xSmallText }}>{item.value}</Text>
      </View>
    </View>
  );
};

export default CostBreakdownItem;

const styles = StyleSheet.create({});

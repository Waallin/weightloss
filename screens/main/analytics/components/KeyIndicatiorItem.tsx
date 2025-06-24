import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { KeyIndicatorType } from "../types";
import { spacing } from "../../../../constants/spacing";
import { colors } from "../../../../constants/colors";
import { globalStyles } from "../../../../constants/globalStyles";

const KeyIndicatiorItem = ({ item }: { item: KeyIndicatorType }) => {
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
          backgroundColor: colors.ui.lightBlueBackground,
          padding: spacing.md,
          borderRadius: spacing.borderRadius,
        }}
      >
        {item.icon}
      </View>
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          {item.title}
        </Text>
        <Text style={{ ...globalStyles.xSmallText }}>{item.info}</Text>
      </View>
      <View
        style={{
          alignItems: "flex-end",
        }}
      >
        <Text
          style={{
            ...globalStyles.bodyText,
            fontWeight: "bold",
            color: item.color,
            fontSize: 18,
          }}
        >
          {item.value}
        </Text>
      </View>
    </View>
  );
};

export default KeyIndicatiorItem;

const styles = StyleSheet.create({});
